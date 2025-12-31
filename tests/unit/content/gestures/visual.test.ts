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
vi.mock('@/shared/utils/settings/settings-storage', () => ({
  loadSettingsFromStorage: vi.fn().mockResolvedValue(undefined),
  saveSettingsToStorage: vi.fn().mockResolvedValue(undefined),
  saveGesturesToStorage: vi.fn().mockResolvedValue(undefined),
  setupStorageListener: vi.fn(),
}));

vi.mock('@/shared/utils/settings/settings-state', () => ({
  getCurrentSettings: vi.fn(),
  getCurrentGestures: vi.fn(),
  updateCurrentSettings: vi.fn(),
  updateCurrentGestures: vi.fn(),
  addSettingsChangeListener: vi.fn(),
  addGesturesChangeListener: vi.fn(),
}));

vi.mock('@/shared/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/content/gestures/visual/visual-trail', () => ({
  startTrail: vi.fn(),
  addTrailPoint: vi.fn(),
  endTrail: vi.fn(),
}));

vi.mock('@/content/gestures/visual/visual-action-name', () => ({
  showActionName: vi.fn(),
  hideActionName: vi.fn(),
  cleanupActionName: vi.fn(),
}));

import { cleanup, startTrail, addTrailPoint, endTrail, showActionName, hideActionName } from '@/content/gestures/visual';
import { endTrail as endTrailOriginal, startTrail as startTrailOriginal, addTrailPoint as addTrailPointOriginal } from '@/content/gestures/visual/visual-trail';
import { cleanupActionName, showActionName as showActionNameOriginal, hideActionName as hideActionNameOriginal } from '@/content/gestures/visual/visual-action-name';
import { Point } from '@/content/gestures/models/point';
import { GestureActionType } from '@/shared/types/gesture-action';

describe('startTrail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('再エクスポートされている場合_元の関数と同じ参照であること', () => {
    expect(startTrail).toBe(startTrailOriginal);
  });

  it('呼び出された場合_元の関数が呼び出されること', () => {
    startTrail();

    expect(startTrailOriginal).toHaveBeenCalledTimes(1);
  });
});

describe('addTrailPoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('再エクスポートされている場合_元の関数と同じ参照であること', () => {
    expect(addTrailPoint).toBe(addTrailPointOriginal);
  });

  it('呼び出された場合_元の関数が正しい引数で呼び出されること', () => {
    const point = new Point(100, 200);
    addTrailPoint(point);

    expect(addTrailPointOriginal).toHaveBeenCalledTimes(1);
    expect(addTrailPointOriginal).toHaveBeenCalledWith(point);
  });
});

describe('endTrail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('再エクスポートされている場合_元の関数と同じ参照であること', () => {
    expect(endTrail).toBe(endTrailOriginal);
  });

  it('呼び出された場合_元の関数が呼び出されること', () => {
    endTrail();

    expect(endTrailOriginal).toHaveBeenCalledTimes(1);
  });
});

describe('showActionName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('再エクスポートされている場合_元の関数と同じ参照であること', () => {
    expect(showActionName).toBe(showActionNameOriginal);
  });

  it('呼び出された場合_元の関数が正しい引数で呼び出されること', () => {
    showActionName(GestureActionType.SCROLL_UP);

    expect(showActionNameOriginal).toHaveBeenCalledTimes(1);
    expect(showActionNameOriginal).toHaveBeenCalledWith(GestureActionType.SCROLL_UP);
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

  it('呼び出された場合_endTrailとcleanupActionNameが呼び出されること', () => {
    cleanup();

    expect(endTrailOriginal).toHaveBeenCalledTimes(1);
    expect(cleanupActionName).toHaveBeenCalledTimes(1);
  });

  it('複数回呼び出された場合_毎回endTrailとcleanupActionNameが呼び出されること', () => {
    cleanup();
    cleanup();
    cleanup();

    expect(endTrailOriginal).toHaveBeenCalledTimes(3);
    expect(cleanupActionName).toHaveBeenCalledTimes(3);
  });

  it('呼び出された場合_endTrailがcleanupActionNameより先に呼び出されること', () => {
    cleanup();

    const endTrailCallOrder = vi.mocked(endTrailOriginal).mock.invocationCallOrder[0];
    const cleanupActionNameCallOrder = vi.mocked(cleanupActionName).mock.invocationCallOrder[0];

    expect(endTrailCallOrder).toBeDefined();
    expect(cleanupActionNameCallOrder).toBeDefined();
    expect(endTrailCallOrder!).toBeLessThan(cleanupActionNameCallOrder!);
  });
});
