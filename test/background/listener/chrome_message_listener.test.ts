import ChromeMessageListener from '../../../src/background/listener/chrome_message_listener';
import Logger from '../../../src/common/utils/logger';
import { BackgroundGestureActionFactory } from '../../../src/background/listener/gesture_action/background_gesture_action_factory';

// 依存モジュールのモック
jest.mock('../../../src/common/utils/logger');
jest.mock('../../../src/background/listener/gesture_action/background_gesture_action_factory');

// 依存クラスのモック
const mockImplementation = {
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    doAction: jest.fn()
  }))
};

jest.mock('../../../src/background/listener/gesture_action/background_select_left_tab_swipe_action', () => mockImplementation);
jest.mock('../../../src/background/listener/gesture_action/background_select_right_tab_swipe_action', () => mockImplementation);
jest.mock('../../../src/background/listener/gesture_action/background_close_and_select_left_tab_swipe_action', () => mockImplementation);
jest.mock('../../../src/background/listener/gesture_action/background_close_and_select_right_tab_swipe_action', () => mockImplementation);

// TYPESのモック
jest.mock('../../../src/common/messaging/types/background_message_type', () => ({
  TYPES: {
    ChromeTabOperator: Symbol('ChromeTabOperator'),
    MessageSender: Symbol('MessageSender')
  }
}));

// container_providerのモック
jest.mock('../../../src/common/utils/container_provider', () => {
  const mockChromeTabOperator = {
    selectLeftTab: jest.fn(),
    closeCurrentTab: jest.fn()
  };
  
  return {
    container: {
      get: jest.fn((type) => {
        if (type === Symbol('ChromeTabOperator')) {
          return mockChromeTabOperator;
        }
        return jest.fn();
      })
    }
  };
});

// Chromeグローバルオブジェクトのモック
global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn()
    }
  }
} as any;

describe('ChromeMessageListenerクラスのテスト', () => {
  let listener: ChromeMessageListener;
  let mockSender: chrome.runtime.MessageSender;
  let mockSendResponse: jest.Mock;

  beforeEach(() => {
    // モックのリセット
    jest.clearAllMocks();
    
    // テスト用のモックオブジェクトを設定
    mockSender = {} as chrome.runtime.MessageSender;
    mockSendResponse = jest.fn();
    
    // リスナーのインスタンス化
    listener = new ChromeMessageListener();
  });

  test('コンストラクタでメッセージリスナーが正しく初期化される', () => {
    expect(chrome.runtime.onMessage.addListener).toHaveBeenCalled();
    expect(Logger.debug).toHaveBeenCalledWith('リスナー初期化');
  });

  test('無効なリクエストの場合、エラーレスポンスを返す', () => {
    // リスナーのコールバックを取得
    const callback = (chrome.runtime.onMessage.addListener as jest.Mock).mock.calls[0][0];
    
    // 無効なリクエストでテスト
    const invalidRequests = [
      undefined,
      null,
      {},
      { action: null },
      { action: 123 }
    ];

    invalidRequests.forEach(request => {
      callback(request, mockSender, mockSendResponse);
      expect(mockSendResponse).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid request: action is required'
      });
    });
  });

  test('有効なリクエストの場合、アクションが実行される', () => {
    const mockAction = {
      doAction: jest.fn()
    };
    (BackgroundGestureActionFactory.createGestureAction as jest.Mock).mockReturnValue(mockAction);

    // リスナーのコールバックを取得
    const callback = (chrome.runtime.onMessage.addListener as jest.Mock).mock.calls[0][0];
    
    // 有効なリクエストでテスト
    const validRequest = { action: 'testAction' };
    callback(validRequest, mockSender, mockSendResponse);

    expect(BackgroundGestureActionFactory.createGestureAction).toHaveBeenCalledWith('testAction');
    expect(mockAction.doAction).toHaveBeenCalledWith(mockSender);
    expect(Logger.debug).toHaveBeenCalledWith('メッセージ受信');
  });
}); 