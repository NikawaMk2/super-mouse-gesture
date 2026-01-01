/**
 * zoom_in_action.ts のインテグレーションテスト
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
let mockTabsGetZoom: Mock;
let mockTabsSetZoom: Mock;

// chrome.storage API をモック化（トップレベルで初期化）
setupInitialChromeMock();

// モック設定後にインポート
import { zoomInAction } from '@/content/gestures/actions/events/zoom_in_action';
import { setupMessageHandlers } from '@/background/handlers';
import { ExtensionMessageType } from '@/shared/types/extension-message';
import { logger } from '@/shared/logger';

describe('zoomInAction', () => {
  beforeEach(() => {
    // chrome.tabs API のモック
    mockTabsQuery = vi.fn();
    mockTabsGetZoom = vi.fn();
    mockTabsSetZoom = vi.fn().mockResolvedValue(undefined);
    
    // グローバルなchromeオブジェクトをモック化
    const result = setupChromeMock({
      tabsQuery: mockTabsQuery,
      tabsGetZoom: mockTabsGetZoom,
      tabsSetZoom: mockTabsSetZoom,
    });
    mockSendMessage = result.mockSendMessage;
    mockOnMessageListeners = result.mockOnMessageListeners;
    
    // モックをリセット
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('コンテンツスクリプトからバックグラウンドへのメッセージフローが正常に動作すること_ページが拡大されること', async () => {
    // バックグラウンド側のメッセージハンドラーを設定
    setupMessageHandlers();
    
    // タブ情報をモック（アクティブなタブが存在する状態）
    const mockTabs = [
      { id: 1, index: 0, active: true, url: 'https://example.com' },
    ];
    mockTabsQuery.mockResolvedValue(mockTabs);
    mockTabsGetZoom.mockResolvedValue(1.0); // 現在のズームレベルは1.0
    
    // コンテンツスクリプト側のアクションを実行
    zoomInAction.execute();
    
    // sendMessageが呼ばれるまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // メッセージが正しく送信されたことを確認
    expect(mockSendMessage).toHaveBeenCalledTimes(1);
    expect(mockSendMessage).toHaveBeenCalledWith({
      type: ExtensionMessageType.ZOOM_IN,
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
      type: ExtensionMessageType.ZOOM_IN,
      payload: null,
    };
    
    const sender = { tab: { id: 1 } };
    
    // リスナーを実行（非同期処理を許可するためtrueを返す）
    const listenerResult = listener(message, sender, sendResponse);
    expect(listenerResult).toBe(true);
    
    // 非同期処理が完了するまで待つ
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // バックグラウンド側のアクションが実行されたことを確認
    expect(mockTabsQuery).toHaveBeenCalledWith({ active: true, currentWindow: true });
    expect(mockTabsGetZoom).toHaveBeenCalledWith(1);
    expect(mockTabsSetZoom).toHaveBeenCalledWith(1, 1.1); // 1.0 + 0.1 = 1.1
    
    // レスポンスが送信されたことを確認
    expect(sendResponse).toHaveBeenCalledWith({ success: true });
  });
  
  it('現在のズームレベルが最大値の場合_ページが拡大されないこと', async () => {
    // バックグラウンド側のメッセージハンドラーを設定
    setupMessageHandlers();
    
    // タブ情報をモック（アクティブなタブが存在する状態）
    const mockTabs = [
      { id: 1, index: 0, active: true, url: 'https://example.com' },
    ];
    mockTabsQuery.mockResolvedValue(mockTabs);
    mockTabsGetZoom.mockResolvedValue(5.0); // 現在のズームレベルは最大値5.0
    
    // コンテンツスクリプト側のアクションを実行
    zoomInAction.execute();
    
    // sendMessageが呼ばれるまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // メッセージリスナーを直接呼び出して、バックグラウンド側の処理を実行
    const listener = mockOnMessageListeners[0];
    expect(listener).toBeDefined();
    if (!listener) throw new Error('Listener is not defined');
    const sendResponse = vi.fn();
    
    const message = {
      type: ExtensionMessageType.ZOOM_IN,
      payload: null,
    };
    
    const sender = { tab: { id: 1 } };
    
    listener(message, sender, sendResponse);
    
    // 非同期処理が完了するまで待つ
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // バックグラウンド側のアクションが実行されたことを確認
    expect(mockTabsQuery).toHaveBeenCalledWith({ active: true, currentWindow: true });
    expect(mockTabsGetZoom).toHaveBeenCalledWith(1);
    // 最大値5.0なので、5.0 + 0.1 = 5.1ではなく、Math.min(5.1, 5.0) = 5.0が設定される
    expect(mockTabsSetZoom).toHaveBeenCalledWith(1, 5.0);
    
    // レスポンスが送信されたことを確認
    expect(sendResponse).toHaveBeenCalledWith({ success: true });
  });
  
  it('アクティブなタブが存在しない場合_ページが拡大されないこと', async () => {
    // バックグラウンド側のメッセージハンドラーを設定
    setupMessageHandlers();
    
    // タブ情報をモック（アクティブなタブが存在しない状態）
    mockTabsQuery.mockResolvedValue([]);
    
    // コンテンツスクリプト側のアクションを実行
    zoomInAction.execute();
    
    // sendMessageが呼ばれるまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // メッセージリスナーを直接呼び出して、バックグラウンド側の処理を実行
    const listener = mockOnMessageListeners[0];
    expect(listener).toBeDefined();
    if (!listener) throw new Error('Listener is not defined');
    const sendResponse = vi.fn();
    
    const message = {
      type: ExtensionMessageType.ZOOM_IN,
      payload: null,
    };
    
    const sender = { tab: { id: 1 } };
    
    listener(message, sender, sendResponse);
    
    // 非同期処理が完了するまで待つ
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // バックグラウンド側のアクションが実行されたことを確認
    expect(mockTabsQuery).toHaveBeenCalledWith({ active: true, currentWindow: true });
    // タブが存在しないため、getZoomとsetZoomは呼ばれない
    expect(mockTabsGetZoom).not.toHaveBeenCalled();
    expect(mockTabsSetZoom).not.toHaveBeenCalled();
    
    // レスポンスは送信される（エラーではない）
    expect(sendResponse).toHaveBeenCalledWith({ success: true });
  });
  
  it('タブIDが存在しない場合_ページが拡大されないこと', async () => {
    // バックグラウンド側のメッセージハンドラーを設定
    setupMessageHandlers();
    
    // タブ情報をモック（タブIDが存在しない状態）
    const mockTabs = [
      { id: undefined, index: 0, active: true, url: 'https://example.com' },
    ];
    mockTabsQuery.mockResolvedValue(mockTabs);
    
    // コンテンツスクリプト側のアクションを実行
    zoomInAction.execute();
    
    // sendMessageが呼ばれるまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // メッセージリスナーを直接呼び出して、バックグラウンド側の処理を実行
    const listener = mockOnMessageListeners[0];
    expect(listener).toBeDefined();
    if (!listener) throw new Error('Listener is not defined');
    const sendResponse = vi.fn();
    
    const message = {
      type: ExtensionMessageType.ZOOM_IN,
      payload: null,
    };
    
    const sender = { tab: { id: 1 } };
    
    listener(message, sender, sendResponse);
    
    // 非同期処理が完了するまで待つ
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // バックグラウンド側のアクションが実行されたことを確認
    expect(mockTabsQuery).toHaveBeenCalledWith({ active: true, currentWindow: true });
    // タブIDが存在しないため、getZoomとsetZoomは呼ばれない
    expect(mockTabsGetZoom).not.toHaveBeenCalled();
    expect(mockTabsSetZoom).not.toHaveBeenCalled();
    
    // レスポンスは送信される（エラーではない）
    expect(sendResponse).toHaveBeenCalledWith({ success: true });
  });
  
  it('メッセージ送信エラーが発生した場合_エラーがログに記録されること', async () => {
    // エラーを発生させる
    const error = new Error('Send message failed');
    mockSendMessage.mockRejectedValue(error);
    
    // コンテンツスクリプト側のアクションを実行
    zoomInAction.execute();
    
    // エラーが処理されるまで待つ
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // logger.errorが正しい引数で呼ばれたことを確認
    expect(vi.mocked(logger.error)).toHaveBeenCalledWith(
      'ZoomInAction',
      'メッセージ送信エラー',
      error
    );
  });
});

