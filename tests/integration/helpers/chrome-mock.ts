/**
 * Chrome API モックの共通ヘルパー
 * 
 * インテグレーションテストで使用するchrome APIのモックを共通化する。
 */
import { vi, type Mock } from 'vitest';

/**
 * Chrome API モックの設定オプション
 */
export interface ChromeMockOptions {
  /**
   * tabs.create API のモック
   */
  tabsCreate?: Mock;
  /**
   * tabs.query API のモック
   */
  tabsQuery?: Mock;
  /**
   * tabs.update API のモック
   */
  tabsUpdate?: Mock;
  /**
   * tabs.remove API のモック
   */
  tabsRemove?: Mock;
  /**
   * tabs.getZoom API のモック
   */
  tabsGetZoom?: Mock;
  /**
   * tabs.setZoom API のモック
   */
  tabsSetZoom?: Mock;
  /**
   * sessions.getRecentlyClosed API のモック
   */
  sessionsGetRecentlyClosed?: Mock;
  /**
   * sessions.restore API のモック
   */
  sessionsRestore?: Mock;
}

/**
 * Chrome API モックの戻り値
 */
export interface ChromeMockResult {
  /**
   * chrome.runtime.sendMessage のモック
   */
  mockSendMessage: Mock;
  /**
   * chrome.runtime.onMessage のリスナー配列
   */
  mockOnMessageListeners: Array<(message: unknown, sender: unknown, sendResponse: (response: unknown) => void) => boolean>;
}

/**
 * Chrome API をモック化する
 * 
 * @param options モックの設定オプション
 * @returns モックオブジェクト
 */
export function setupChromeMock(options: ChromeMockOptions = {}): ChromeMockResult {
  // chrome.runtime.sendMessage のモック
  const mockSendMessage = vi.fn().mockResolvedValue({ success: true });
  
  // chrome.runtime.onMessage のリスナーを保存する配列
  const mockOnMessageListeners: Array<(message: unknown, sender: unknown, sendResponse: (response: unknown) => void) => boolean> = [];
  
  // グローバルなchromeオブジェクトをモック化
  global.chrome = {
    storage: {
      local: {
        get: vi.fn(),
        set: vi.fn(),
      },
      onChanged: {
        addListener: vi.fn(),
      },
    },
    runtime: {
      sendMessage: mockSendMessage,
      onMessage: {
        addListener: vi.fn((listener) => {
          mockOnMessageListeners.push(listener);
        }),
        removeListener: vi.fn(),
      },
    },
    tabs: {
      ...(options.tabsCreate && { create: options.tabsCreate }),
      ...(options.tabsQuery && { query: options.tabsQuery }),
      ...(options.tabsUpdate && { update: options.tabsUpdate }),
      ...(options.tabsRemove && { remove: options.tabsRemove }),
      ...(options.tabsGetZoom && { getZoom: options.tabsGetZoom }),
      ...(options.tabsSetZoom && { setZoom: options.tabsSetZoom }),
    },
    ...(options.sessionsGetRecentlyClosed || options.sessionsRestore ? {
      sessions: {
        ...(options.sessionsGetRecentlyClosed && { getRecentlyClosed: options.sessionsGetRecentlyClosed }),
        ...(options.sessionsRestore && { restore: options.sessionsRestore }),
      },
    } : {}),
  } as unknown as typeof chrome;
  
  return {
    mockSendMessage,
    mockOnMessageListeners,
  };
}

/**
 * Chrome API の初期モックを設定する（トップレベルでの初期化用）
 * 
 * テストファイルのトップレベルで呼び出して、基本的なchrome APIのモックを設定する。
 */
export function setupInitialChromeMock(): void {
  global.chrome = {
    storage: {
      local: {
        get: vi.fn(),
        set: vi.fn(),
      },
      onChanged: {
        addListener: vi.fn(),
      },
    },
    runtime: {
      sendMessage: vi.fn().mockResolvedValue({ success: true }),
      onMessage: {
        addListener: vi.fn(),
        removeListener: vi.fn(),
      },
    },
    tabs: {
      create: vi.fn().mockResolvedValue({ id: 1 }),
      query: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
      getZoom: vi.fn(),
      setZoom: vi.fn().mockResolvedValue(undefined),
    },
    sessions: {
      getRecentlyClosed: vi.fn().mockResolvedValue([]),
      restore: vi.fn().mockResolvedValue(undefined),
    },
  } as unknown as typeof chrome;
}

