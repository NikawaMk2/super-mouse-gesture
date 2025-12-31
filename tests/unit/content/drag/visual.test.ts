/**
 * visual.ts のユニットテスト
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// chrome.storage API をモック化
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
} as unknown as typeof chrome;

// モジュールをモック化（インポートの前に配置）
vi.mock('@/shared/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/content/drag/visual/visual-action-name', () => ({
  showActionName: vi.fn(),
  hideActionName: vi.fn(),
  cleanupActionName: vi.fn(),
}));

import { showActionName, hideActionName, cleanup } from '@/content/drag/visual';
import { showActionName as showActionNameOriginal, hideActionName as hideActionNameOriginal, cleanupActionName as cleanupActionNameOriginal } from '@/content/drag/visual/visual-action-name';
import { DragDataType } from '@/content/drag/actions/drag_action_factory';

describe('showActionName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('再エクスポートされている場合_元の関数と同じ参照であること', () => {
    expect(showActionName).toBe(showActionNameOriginal);
  });

  it('呼び出された場合_元の関数が正しい引数で呼び出されること', () => {
    showActionName(DragDataType.LINK);

    expect(showActionNameOriginal).toHaveBeenCalledTimes(1);
    expect(showActionNameOriginal).toHaveBeenCalledWith(DragDataType.LINK);
  });
});

describe('hideActionName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('再エクスポートされている場合_元の関数と同じ参照であること', () => {
    expect(hideActionName).toBe(hideActionNameOriginal);
  });

  it('呼び出された場合_元の関数が呼び出されること', () => {
    hideActionName();

    expect(hideActionNameOriginal).toHaveBeenCalledTimes(1);
  });
});

describe('cleanup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('呼び出された場合_cleanupActionNameが呼び出されること', () => {
    cleanup();

    expect(cleanupActionNameOriginal).toHaveBeenCalledTimes(1);
  });

  it('複数回呼び出された場合_毎回cleanupActionNameが呼び出されること', () => {
    cleanup();
    cleanup();
    cleanup();

    expect(cleanupActionNameOriginal).toHaveBeenCalledTimes(3);
  });
});

