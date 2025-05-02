/**
 * @jest-environment jsdom
 */
const mockAddListener = jest.fn();
const mockSendResponse = jest.fn();
const mockDestroy = jest.fn();
const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

jest.mock('../../src/content/content_script_main', () => {
  return {
    ContentScriptMain: jest.fn().mockImplementation(() => ({
      destroy: mockDestroy,
    })),
  };
});

jest.mock('../../src/common/logger/logger', () => mockLogger);

describe('content/index.ts', () => {
  let onMessageCallback: any;
  let unloadCallback: any;

  beforeAll(() => {
    // chrome.runtime.onMessage.addListenerのモック
    (global as any).chrome = {
      runtime: {
        onMessage: {
          addListener: (cb: any) => {
            onMessageCallback = cb;
          },
        },
      },
    };
    // window.addEventListenerのモック
    jest.spyOn(window, 'addEventListener').mockImplementation((event, cb) => {
      if (event === 'unload') unloadCallback = cb;
    });
    // テスト対象を遅延import
    require('../../src/content/index');
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // ContentScriptMainのインスタンス生成をリセット
    const { ContentScriptMain } = require('../../src/content/content_script_main');
    (ContentScriptMain as jest.Mock).mockClear();
  });

  it('toggleEnabled: enabled=trueでContentScriptMain生成', () => {
    onMessageCallback({ action: 'toggleEnabled', payload: { enabled: true } }, {}, mockSendResponse);
    expect(mockLogger.debug).toHaveBeenCalledWith('onMessage: toggleEnabled受信', { enabled: true });
    expect(mockSendResponse).toHaveBeenCalledWith({ result: 'ok' });
  });

  it('toggleEnabled: enabled=falseでContentScriptMain破棄', () => {
    // まず有効化
    onMessageCallback({ action: 'toggleEnabled', payload: { enabled: true } }, {}, mockSendResponse);
    // 次に無効化
    onMessageCallback({ action: 'toggleEnabled', payload: { enabled: false } }, {}, mockSendResponse);
    expect(mockDestroy).toHaveBeenCalled();
    expect(mockLogger.debug).toHaveBeenCalledWith('ContentScriptMainを破棄');
    expect(mockSendResponse).toHaveBeenCalledWith({ result: 'ok' });
  });

  it('toggleEnabled: payload不正', () => {
    onMessageCallback({ action: 'toggleEnabled', payload: { wrong: true } }, {}, mockSendResponse);
    expect(mockLogger.debug).toHaveBeenCalledWith('onMessage: toggleEnabledのpayload不正', { payload: { wrong: true } });
    expect(mockSendResponse).toHaveBeenCalledWith({ result: 'invalid payload' });
  });

  it('settingsUpdated: ContentScriptMain再生成', () => {
    // まず有効化
    onMessageCallback({ action: 'toggleEnabled', payload: { enabled: true } }, {}, mockSendResponse);
    // 設定更新
    onMessageCallback({ action: 'settingsUpdated' }, {}, mockSendResponse);
    expect(mockDestroy).toHaveBeenCalled();
    expect(mockLogger.debug).toHaveBeenCalledWith('ContentScriptMainを破棄（settingsUpdated）');
    expect(mockLogger.debug).toHaveBeenCalledWith('ContentScriptMainを再生成（settingsUpdated）');
    expect(mockSendResponse).toHaveBeenCalledWith({ result: 'ok' });
  });

  it('未対応action', () => {
    const result = onMessageCallback({ action: 'unknownAction' }, {}, mockSendResponse);
    expect(mockLogger.debug).toHaveBeenCalledWith('onMessage: 未対応action受信', { action: 'unknownAction' });
    expect(result).toBe(false);
  });

  it('不正なメッセージ', () => {
    const result = onMessageCallback(null, {}, mockSendResponse);
    expect(mockLogger.debug).toHaveBeenCalledWith('onMessage: 不正なメッセージ受信', { message: null });
    expect(result).toBe(false);
  });

  it('unloadイベントでContentScriptMain破棄', () => {
    // まず有効化
    onMessageCallback({ action: 'toggleEnabled', payload: { enabled: true } }, {}, mockSendResponse);
    unloadCallback();
    expect(mockDestroy).toHaveBeenCalled();
    expect(mockLogger.debug).toHaveBeenCalledWith('unload: ContentScriptMainを破棄');
  });
}); 