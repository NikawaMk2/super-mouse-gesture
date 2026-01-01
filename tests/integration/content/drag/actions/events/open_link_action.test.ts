/**
 * open_link_action.ts のインテグレーションテスト
 * 
 * コンテンツスクリプト側のアクションからバックグラウンド側の処理までの
 * メッセージフロー全体を統合的にテストする。
 */
import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';

// モジュールをモック化（インポートの前に配置）
vi.mock('@/shared/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/shared/utils/settings/settings-storage', () => ({
  loadSettingsFromStorage: vi.fn().mockResolvedValue(undefined),
  saveSettingsToStorage: vi.fn().mockResolvedValue(undefined),
  saveGesturesToStorage: vi.fn().mockResolvedValue(undefined),
  setupStorageListener: vi.fn(),
}));

vi.mock('@/shared/utils/settings/settings-state', () => ({
  getCurrentSettings: vi.fn(() => ({})),
  getCurrentGestures: vi.fn(() => ({})),
  updateCurrentSettings: vi.fn(),
  updateCurrentGestures: vi.fn(),
  addSettingsChangeListener: vi.fn(),
  addGesturesChangeListener: vi.fn(),
}));

// chrome API をモック化（トップレベルで初期化）
import { setupInitialChromeMock, setupChromeMock } from '../../../../helpers/chrome-mock';

let mockSendMessage: Mock;
let mockOnMessageListeners: Array<(message: unknown, sender: unknown, sendResponse: (response: unknown) => void) => boolean>;
let mockTabsCreate: Mock;

// chrome.storage API をモック化（トップレベルで初期化）
setupInitialChromeMock();

// モック設定後にインポート
import { openLinkAction } from '@/content/drag/actions/events/open_link_action';
import { setupMessageHandlers } from '@/background/handlers';
import { ExtensionMessageType } from '@/shared/types/extension-message';
import { logger } from '@/shared/logger';

describe('openLinkAction', () => {
  beforeEach(() => {
    // chrome.tabs.create API のモック
    mockTabsCreate = vi.fn().mockResolvedValue({ id: 1 });
    
    // グローバルなchromeオブジェクトをモック化
    const result = setupChromeMock({
      tabsCreate: mockTabsCreate,
    });
    mockSendMessage = result.mockSendMessage;
    mockOnMessageListeners = result.mockOnMessageListeners;
    
    // モックをリセット
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('URLが指定されている場合_コンテンツスクリプトからバックグラウンドへのメッセージフローが正常に動作して新しいタブが作成されること', async () => {
    // バックグラウンド側のメッセージハンドラーを設定
    setupMessageHandlers();
    
    const testUrl = 'https://example.com';
    
    // コンテンツスクリプト側のアクションを実行
    openLinkAction.execute(testUrl);
    
    // sendMessageが呼ばれるまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // メッセージが正しく送信されたことを確認
    expect(mockSendMessage).toHaveBeenCalledTimes(1);
    expect(mockSendMessage).toHaveBeenCalledWith({
      type: ExtensionMessageType.DRAG_OPEN_LINK,
      payload: {
        url: testUrl,
        active: true,
      },
    });
    
    // メッセージリスナーが登録されていることを確認
    expect(mockOnMessageListeners.length).toBe(1);
    
    // メッセージリスナーを直接呼び出して、バックグラウンド側の処理を実行
    const listener = mockOnMessageListeners[0];
    expect(listener).toBeDefined();
    if (!listener) throw new Error('Listener is not defined');
    const sendResponse = vi.fn();
    
    const message = {
      type: ExtensionMessageType.DRAG_OPEN_LINK,
      payload: {
        url: testUrl,
        active: true,
      },
    };
    
    const sender = { tab: { id: 1 } };
    
    // リスナーを実行（非同期処理を許可するためtrueを返す）
    const listenerResult = listener(message, sender, sendResponse);
    expect(listenerResult).toBe(true);
    
    // 非同期処理が完了するまで待つ
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // バックグラウンド側のアクションが実行されたことを確認
    expect(mockTabsCreate).toHaveBeenCalledTimes(1);
    expect(mockTabsCreate).toHaveBeenCalledWith({
      url: testUrl,
      active: true,
    });
    
    // レスポンスが送信されたことを確認
    expect(sendResponse).toHaveBeenCalledWith({ success: true });
  });
  
  it('URLが指定されていない場合_警告ログが記録されてメッセージが送信されないこと', async () => {
    // コンテンツスクリプト側のアクションを実行（URLなし）
    openLinkAction.execute();
    
    // 処理が完了するまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // 警告ログが記録されたことを確認
    expect(vi.mocked(logger.warn)).toHaveBeenCalledWith(
      'OpenLinkAction',
      'URLが指定されていません'
    );
    
    // メッセージが送信されていないことを確認
    expect(mockSendMessage).not.toHaveBeenCalled();
  });
  
  it('メッセージ送信エラーが発生した場合_エラーがログに記録されること', async () => {
    // エラーを発生させる
    const error = new Error('Send message failed');
    mockSendMessage.mockRejectedValue(error);
    
    const testUrl = 'https://example.com';
    
    // コンテンツスクリプト側のアクションを実行
    openLinkAction.execute(testUrl);
    
    // エラーが処理されるまで待つ
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // logger.errorが正しい引数で呼ばれたことを確認
    expect(vi.mocked(logger.error)).toHaveBeenCalledWith(
      'OpenLinkAction',
      'メッセージ送信エラー',
      error
    );
  });
});

