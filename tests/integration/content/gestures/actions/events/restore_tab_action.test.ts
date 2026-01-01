/**
 * restore_tab_action.ts のインテグレーションテスト
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
let mockSessionsGetRecentlyClosed: Mock;
let mockSessionsRestore: Mock;

// chrome.storage API をモック化（トップレベルで初期化）
setupInitialChromeMock();

// モック設定後にインポート
import { restoreTabAction } from '@/content/gestures/actions/events/restore_tab_action';
import { setupMessageHandlers } from '@/background/handlers';
import { ExtensionMessageType } from '@/shared/types/extension-message';
import { logger } from '@/shared/logger';

describe('restoreTabAction', () => {
  beforeEach(() => {
    // chrome.sessions API のモック
    mockSessionsGetRecentlyClosed = vi.fn();
    mockSessionsRestore = vi.fn().mockResolvedValue(undefined);
    
    // グローバルなchromeオブジェクトをモック化
    const result = setupChromeMock({
      sessionsGetRecentlyClosed: mockSessionsGetRecentlyClosed,
      sessionsRestore: mockSessionsRestore,
    });
    mockSendMessage = result.mockSendMessage;
    mockOnMessageListeners = result.mockOnMessageListeners;
    
    // モックをリセット
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('コンテンツスクリプトからバックグラウンドへのメッセージフローが正常に動作すること_タブが復元されること', async () => {
    // バックグラウンド側のメッセージハンドラーを設定
    setupMessageHandlers();
    
    // セッション情報をモック（最近閉じたタブが存在する状態）
    const mockSessions = [
      {
        tab: {
          sessionId: 'session-id-123',
          url: 'https://example.com/closed-tab',
        },
      },
    ];
    mockSessionsGetRecentlyClosed.mockResolvedValue(mockSessions);
    
    // コンテンツスクリプト側のアクションを実行
    restoreTabAction.execute();
    
    // sendMessageが呼ばれるまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // メッセージが正しく送信されたことを確認
    expect(mockSendMessage).toHaveBeenCalledTimes(1);
    expect(mockSendMessage).toHaveBeenCalledWith({
      type: ExtensionMessageType.RESTORE_TAB,
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
      type: ExtensionMessageType.RESTORE_TAB,
      payload: null,
    };
    
    const sender = { tab: { id: 2 } };
    
    // リスナーを実行（非同期処理を許可するためtrueを返す）
    const listenerResult = listener(message, sender, sendResponse);
    expect(listenerResult).toBe(true);
    
    // 非同期処理が完了するまで待つ
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // バックグラウンド側のアクションが実行されたことを確認
    expect(mockSessionsGetRecentlyClosed).toHaveBeenCalledWith({ maxResults: 1 });
    expect(mockSessionsRestore).toHaveBeenCalledWith('session-id-123');
    
    // レスポンスが送信されたことを確認
    expect(sendResponse).toHaveBeenCalledWith({ success: true });
  });
  
  it('最近閉じたタブが存在しない場合_タブが復元されないこと', async () => {
    // バックグラウンド側のメッセージハンドラーを設定
    setupMessageHandlers();
    
    // セッション情報をモック（最近閉じたタブが存在しない状態）
    mockSessionsGetRecentlyClosed.mockResolvedValue([]);
    
    // コンテンツスクリプト側のアクションを実行
    restoreTabAction.execute();
    
    // sendMessageが呼ばれるまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // メッセージリスナーを直接呼び出して、バックグラウンド側の処理を実行
    const listener = mockOnMessageListeners[0];
    expect(listener).toBeDefined();
    if (!listener) throw new Error('Listener is not defined');
    const sendResponse = vi.fn();
    
    const message = {
      type: ExtensionMessageType.RESTORE_TAB,
      payload: null,
    };
    
    const sender = { tab: { id: 1 } };
    
    listener(message, sender, sendResponse);
    
    // 非同期処理が完了するまで待つ
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // セッション取得は呼ばれるが、復元は呼ばれないことを確認
    expect(mockSessionsGetRecentlyClosed).toHaveBeenCalledWith({ maxResults: 1 });
    expect(mockSessionsRestore).not.toHaveBeenCalled();
    
    // レスポンスは送信される（エラーではない）
    expect(sendResponse).toHaveBeenCalledWith({ success: true });
  });
  
  it('セッション情報にtabが存在しない場合_タブが復元されないこと', async () => {
    // バックグラウンド側のメッセージハンドラーを設定
    setupMessageHandlers();
    
    // セッション情報をモック（tabが存在しない状態）
    const mockSessions = [
      {
        window: {
          sessionId: 'session-id-123',
        },
      },
    ];
    mockSessionsGetRecentlyClosed.mockResolvedValue(mockSessions);
    
    // コンテンツスクリプト側のアクションを実行
    restoreTabAction.execute();
    
    // sendMessageが呼ばれるまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // メッセージリスナーを直接呼び出して、バックグラウンド側の処理を実行
    const listener = mockOnMessageListeners[0];
    expect(listener).toBeDefined();
    if (!listener) throw new Error('Listener is not defined');
    const sendResponse = vi.fn();
    
    const message = {
      type: ExtensionMessageType.RESTORE_TAB,
      payload: null,
    };
    
    const sender = { tab: { id: 1 } };
    
    listener(message, sender, sendResponse);
    
    // 非同期処理が完了するまで待つ
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // セッション取得は呼ばれるが、復元は呼ばれないことを確認
    expect(mockSessionsGetRecentlyClosed).toHaveBeenCalledWith({ maxResults: 1 });
    expect(mockSessionsRestore).not.toHaveBeenCalled();
    
    // レスポンスは送信される（エラーではない）
    expect(sendResponse).toHaveBeenCalledWith({ success: true });
  });
  
  it('セッション情報にsessionIdが存在しない場合_タブが復元されないこと', async () => {
    // バックグラウンド側のメッセージハンドラーを設定
    setupMessageHandlers();
    
    // セッション情報をモック（sessionIdが存在しない状態）
    const mockSessions = [
      {
        tab: {
          url: 'https://example.com/closed-tab',
        },
      },
    ];
    mockSessionsGetRecentlyClosed.mockResolvedValue(mockSessions);
    
    // コンテンツスクリプト側のアクションを実行
    restoreTabAction.execute();
    
    // sendMessageが呼ばれるまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // メッセージリスナーを直接呼び出して、バックグラウンド側の処理を実行
    const listener = mockOnMessageListeners[0];
    expect(listener).toBeDefined();
    if (!listener) throw new Error('Listener is not defined');
    const sendResponse = vi.fn();
    
    const message = {
      type: ExtensionMessageType.RESTORE_TAB,
      payload: null,
    };
    
    const sender = { tab: { id: 1 } };
    
    listener(message, sender, sendResponse);
    
    // 非同期処理が完了するまで待つ
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // セッション取得は呼ばれるが、復元は呼ばれないことを確認
    expect(mockSessionsGetRecentlyClosed).toHaveBeenCalledWith({ maxResults: 1 });
    expect(mockSessionsRestore).not.toHaveBeenCalled();
    
    // レスポンスは送信される（エラーではない）
    expect(sendResponse).toHaveBeenCalledWith({ success: true });
  });
  
  it('メッセージ送信エラーが発生した場合_エラーがログに記録されること', async () => {
    // エラーを発生させる（常にエラーを返すように設定）
    const error = new Error('Send message failed');
    mockSendMessage.mockImplementation(() => Promise.reject(error));
    
    // コンテンツスクリプト側のアクションを実行
    restoreTabAction.execute();
    
    // エラーが処理されるまで待つ（sendMessageWithRetryは最大3回再試行し、各再試行間に100ms待機するため、最大400ms待つ）
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    // logger.errorが正しい引数で呼ばれたことを確認
    expect(vi.mocked(logger.error)).toHaveBeenCalledWith(
      'RestoreTabAction',
      'メッセージ送信エラー',
      error
    );
  });
});

