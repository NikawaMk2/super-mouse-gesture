/**
 * close_tab_and_go_right_action.ts のインテグレーションテスト
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
let mockTabsQuery: Mock;
let mockTabsUpdate: Mock;
let mockTabsRemove: Mock;

// chrome.storage API をモック化（トップレベルで初期化）
setupInitialChromeMock();

// モック設定後にインポート
import { closeTabAndGoRightAction } from '@/content/gestures/actions/events/close_tab_and_go_right_action';
import { setupMessageHandlers } from '@/background/handlers';
import { ExtensionMessageType } from '@/shared/types/extension-message';
import { logger } from '@/shared/logger';

describe('closeTabAndGoRightAction', () => {
  beforeEach(() => {
    // chrome.tabs API のモック
    mockTabsQuery = vi.fn();
    mockTabsUpdate = vi.fn().mockResolvedValue(undefined);
    mockTabsRemove = vi.fn().mockResolvedValue(undefined);
    
    // グローバルなchromeオブジェクトをモック化
    const result = setupChromeMock({
      tabsQuery: mockTabsQuery,
      tabsUpdate: mockTabsUpdate,
      tabsRemove: mockTabsRemove,
    });
    mockSendMessage = result.mockSendMessage;
    mockOnMessageListeners = result.mockOnMessageListeners;
    
    // モックをリセット
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('コンテンツスクリプトからバックグラウンドへのメッセージフローが正常に動作すること_次のタブが存在する場合', async () => {
    // バックグラウンド側のメッセージハンドラーを設定
    setupMessageHandlers();
    
    // タブ情報をモック（現在のタブと次のタブがある状態）
    const mockTabs = [
      { id: 1, index: 0, active: false, url: 'https://example.com/tab1' },
      { id: 2, index: 1, active: true, url: 'https://example.com/tab2' }, // 現在のタブ
      { id: 3, index: 2, active: false, url: 'https://example.com/tab3' }, // 次のタブ
    ];
    mockTabsQuery.mockResolvedValue(mockTabs);
    
    // コンテンツスクリプト側のアクションを実行
    closeTabAndGoRightAction.execute();
    
    // sendMessageが呼ばれるまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // メッセージが正しく送信されたことを確認
    expect(mockSendMessage).toHaveBeenCalledTimes(1);
    expect(mockSendMessage).toHaveBeenCalledWith({
      type: ExtensionMessageType.CLOSE_TAB_AND_GO_RIGHT,
      payload: null,
    });
    
    // メッセージリスナーが登録されていることを確認
    expect(mockOnMessageListeners.length).toBe(1);
    
    // メッセージリスナーを直接呼び出して、バックグラウンド側の処理を実行
    const listener = mockOnMessageListeners[0];
    expect(listener).toBeDefined();
    if (!listener) throw new Error('Listener is not defined');
    const sendResponse = vi.fn();
    
    const message = {
      type: ExtensionMessageType.CLOSE_TAB_AND_GO_RIGHT,
      payload: null,
    };
    
    const sender = { tab: { id: 2 } };
    
    // リスナーを実行（非同期処理を許可するためtrueを返す）
    const listenerResult = listener(message, sender, sendResponse);
    expect(listenerResult).toBe(true);
    
    // 非同期処理が完了するまで待つ
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // バックグラウンド側のアクションが実行されたことを確認
    expect(mockTabsQuery).toHaveBeenCalledWith({ currentWindow: true });
    expect(mockTabsUpdate).toHaveBeenCalledWith(3, { active: true }); // 次のタブ（index 2）をアクティブにする
    expect(mockTabsRemove).toHaveBeenCalledWith(2); // 現在のタブ（index 1）を削除
    
    // レスポンスが送信されたことを確認
    expect(sendResponse).toHaveBeenCalledWith({ success: true });
  });
  
  it('右にタブが存在しない場合_タブが削除されないこと', async () => {
    // バックグラウンド側のメッセージハンドラーを設定
    setupMessageHandlers();
    
    // タブ情報をモック（現在のタブが最後のタブで、次のタブが存在しない状態）
    const mockTabs = [
      { id: 1, index: 0, active: false, url: 'https://example.com/tab1' },
      { id: 2, index: 1, active: true, url: 'https://example.com/tab2' }, // 現在のタブ（最後のタブ）
    ];
    mockTabsQuery.mockResolvedValue(mockTabs);
    
    // コンテンツスクリプト側のアクションを実行
    closeTabAndGoRightAction.execute();
    
    // sendMessageが呼ばれるまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // メッセージリスナーを直接呼び出して、バックグラウンド側の処理を実行
    const listener = mockOnMessageListeners[0];
    expect(listener).toBeDefined();
    if (!listener) throw new Error('Listener is not defined');
    const sendResponse = vi.fn();
    
    const message = {
      type: ExtensionMessageType.CLOSE_TAB_AND_GO_RIGHT,
      payload: null,
    };
    
    const sender = { tab: { id: 2 } };
    
    listener(message, sender, sendResponse);
    
    // 非同期処理が完了するまで待つ
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // タブの更新や削除が呼ばれないことを確認
    expect(mockTabsQuery).toHaveBeenCalledWith({ currentWindow: true });
    expect(mockTabsUpdate).not.toHaveBeenCalled();
    expect(mockTabsRemove).not.toHaveBeenCalled();
    
    // レスポンスは送信される（エラーではない）
    expect(sendResponse).toHaveBeenCalledWith({ success: true });
  });
  
  it('メッセージ送信エラーが発生した場合_エラーがログに記録されること', async () => {
    // エラーを発生させる
    const error = new Error('Send message failed');
    mockSendMessage.mockRejectedValue(error);
    
    // コンテンツスクリプト側のアクションを実行
    closeTabAndGoRightAction.execute();
    
    // エラーが処理されるまで待つ
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // logger.errorが正しい引数で呼ばれたことを確認
    expect(vi.mocked(logger.error)).toHaveBeenCalledWith(
      'CloseTabAndGoRightAction',
      'メッセージ送信エラー',
      error
    );
  });
});

