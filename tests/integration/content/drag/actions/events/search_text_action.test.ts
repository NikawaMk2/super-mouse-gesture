/**
 * search_text_action.ts のインテグレーションテスト
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
import { searchTextAction } from '@/content/drag/actions/events/search_text_action';
import { setupMessageHandlers } from '@/background/handlers';
import { ExtensionMessageType } from '@/shared/types/extension-message';
import { logger } from '@/shared/logger';

describe('searchTextAction', () => {
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
  
  it('テキストが指定されている場合_コンテンツスクリプトからバックグラウンドへのメッセージフローが正常に動作して新しいタブが作成されること', async () => {
    // バックグラウンド側のメッセージハンドラーを設定
    setupMessageHandlers();
    
    const testText = 'test search query';
    
    // コンテンツスクリプト側のアクションを実行
    searchTextAction.execute(testText);
    
    // sendMessageが呼ばれるまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // メッセージが正しく送信されたことを確認
    expect(mockSendMessage).toHaveBeenCalledTimes(1);
    expect(mockSendMessage).toHaveBeenCalledWith({
      type: ExtensionMessageType.DRAG_SEARCH_TEXT,
      payload: {
        text: testText,
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
      type: ExtensionMessageType.DRAG_SEARCH_TEXT,
      payload: {
        text: testText,
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
      url: `https://www.google.com/search?q=${encodeURIComponent(testText)}`,
      active: true,
    });
    
    // レスポンスが送信されたことを確認
    expect(sendResponse).toHaveBeenCalledWith({ success: true });
  });
  
  it('テキストが指定されていない場合_警告ログが記録されてメッセージが送信されないこと', async () => {
    // コンテンツスクリプト側のアクションを実行（テキストなし）
    searchTextAction.execute();
    
    // 処理が完了するまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // 警告ログが記録されたことを確認
    expect(vi.mocked(logger.warn)).toHaveBeenCalledWith(
      'SearchTextAction',
      '検索テキストが指定されていません'
    );
    
    // メッセージが送信されていないことを確認
    expect(mockSendMessage).not.toHaveBeenCalled();
  });
  
  it('テキストが空文字列の場合_警告ログが記録されてメッセージが送信されないこと', async () => {
    // コンテンツスクリプト側のアクションを実行（空文字列）
    searchTextAction.execute('');
    
    // 処理が完了するまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // 警告ログが記録されたことを確認
    expect(vi.mocked(logger.warn)).toHaveBeenCalledWith(
      'SearchTextAction',
      '検索テキストが指定されていません'
    );
    
    // メッセージが送信されていないことを確認
    expect(mockSendMessage).not.toHaveBeenCalled();
  });
  
  it('テキストが空白のみの場合_警告ログが記録されてメッセージが送信されないこと', async () => {
    // コンテンツスクリプト側のアクションを実行（空白のみ）
    searchTextAction.execute('   ');
    
    // 処理が完了するまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // 警告ログが記録されたことを確認
    expect(vi.mocked(logger.warn)).toHaveBeenCalledWith(
      'SearchTextAction',
      '検索テキストが指定されていません'
    );
    
    // メッセージが送信されていないことを確認
    expect(mockSendMessage).not.toHaveBeenCalled();
  });
  
  it('テキストの前後に空白がある場合_空白がトリムされて検索URLが作成されること', async () => {
    // バックグラウンド側のメッセージハンドラーを設定
    setupMessageHandlers();
    
    const testText = '  test search query  ';
    const trimmedText = 'test search query';
    
    // コンテンツスクリプト側のアクションを実行
    searchTextAction.execute(testText);
    
    // sendMessageが呼ばれるまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    // メッセージが正しく送信されたことを確認（トリムされたテキスト）
    expect(mockSendMessage).toHaveBeenCalledTimes(1);
    expect(mockSendMessage).toHaveBeenCalledWith({
      type: ExtensionMessageType.DRAG_SEARCH_TEXT,
      payload: {
        text: trimmedText,
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
      type: ExtensionMessageType.DRAG_SEARCH_TEXT,
      payload: {
        text: trimmedText,
      },
    };
    
    const sender = { tab: { id: 1 } };
    
    // リスナーを実行（非同期処理を許可するためtrueを返す）
    const listenerResult = listener(message, sender, sendResponse);
    expect(listenerResult).toBe(true);
    
    // 非同期処理が完了するまで待つ
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // バックグラウンド側のアクションが実行されたことを確認（トリムされたテキストで検索URLが作成される）
    expect(mockTabsCreate).toHaveBeenCalledTimes(1);
    expect(mockTabsCreate).toHaveBeenCalledWith({
      url: `https://www.google.com/search?q=${encodeURIComponent(trimmedText)}`,
      active: true,
    });
    
    // レスポンスが送信されたことを確認
    expect(sendResponse).toHaveBeenCalledWith({ success: true });
  });
  
  it('メッセージ送信エラーが発生した場合_エラーがログに記録されること', async () => {
    // エラーを発生させる
    const error = new Error('Send message failed');
    mockSendMessage.mockRejectedValue(error);
    
    const testText = 'test search query';
    
    // コンテンツスクリプト側のアクションを実行
    searchTextAction.execute(testText);
    
    // エラーが処理されるまで待つ
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // logger.errorが正しい引数で呼ばれたことを確認
    expect(vi.mocked(logger.error)).toHaveBeenCalledWith(
      'SearchTextAction',
      'メッセージ送信エラー',
      error
    );
  });
});

