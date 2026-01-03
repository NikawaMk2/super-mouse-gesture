/**
 * settings.ts のユニットテスト
 * 
 * 設定管理ユーティリティの各関数の動作をテストする。
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

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
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

import { settings } from '@/shared/utils/settings';
import { GestureActionType } from '@/shared/types/gesture-action';
import type { Settings, GestureDefinitions } from '@/shared/utils/settings';
import { DEFAULT_SETTINGS, DEFAULT_GESTURES } from '@/shared/utils/settings/settings-types';
import * as settingsStorage from '@/shared/utils/settings/settings-storage';
import * as settingsState from '@/shared/utils/settings/settings-state';

describe('settings.initialize', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('ストレージから設定を読み込む場合_設定管理を初期化すること', async () => {
    await settings.initialize();

    expect(settingsStorage.loadSettingsFromStorage).toHaveBeenCalledOnce();
    expect(settingsStorage.setupStorageListener).toHaveBeenCalledOnce();
  });

  it('ストレージ読み込みが失敗する場合_エラーをスローすること', async () => {
    vi.mocked(settingsStorage.loadSettingsFromStorage).mockRejectedValueOnce(new Error('ストレージ読み込みエラー'));

    await expect(settings.initialize()).rejects.toThrow('ストレージ読み込みエラー');
  });
});

describe('settings.getSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('現在の設定値が存在する場合_読み取り専用のコピーを返すこと', () => {
    const mockSettings: Settings = {
      ...DEFAULT_SETTINGS,
      enableGestures: false,
      trailColor: '#FF0000',
    };
    vi.mocked(settingsState.getCurrentSettings).mockReturnValue(mockSettings);

    const result = settings.getSettings();

    expect(result).toEqual(mockSettings);
    expect(result).not.toBe(mockSettings); // コピーであることを確認
  });

  it('設定値を変更しても元の設定が変更されないこと_読み取り専用のコピーを返すこと', () => {
    const mockSettings: Settings = { ...DEFAULT_SETTINGS };
    vi.mocked(settingsState.getCurrentSettings).mockReturnValue(mockSettings);

    const result1 = settings.getSettings();
    // 型アサーションを使って一時的に書き込み可能にして変更を試みる
    (result1 as Settings).enableGestures = false;

    // 再度取得した設定が元の値であることを確認（独立したコピーであることを確認）
    const result2 = settings.getSettings();
    expect(result2.enableGestures).toBe(mockSettings.enableGestures);
  });

  it('設定値が存在しない場合_デフォルト値を返すこと', () => {
    vi.mocked(settingsState.getCurrentSettings).mockReturnValue(DEFAULT_SETTINGS);

    const result = settings.getSettings();

    expect(result).toEqual(DEFAULT_SETTINGS);
    expect(result.enableGestures).toBe(DEFAULT_SETTINGS.enableGestures);
    expect(result.enableDrag).toBe(DEFAULT_SETTINGS.enableDrag);
    expect(result.trailColor).toBe(DEFAULT_SETTINGS.trailColor);
    expect(result.trailWidth).toBe(DEFAULT_SETTINGS.trailWidth);
    expect(result.minGestureDistance).toBe(DEFAULT_SETTINGS.minGestureDistance);
    expect(result.searchEngineUrl).toBe(DEFAULT_SETTINGS.searchEngineUrl);
  });
});

describe('settings.getGestures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('現在のジェスチャ定義が存在する場合_読み取り専用のコピーを返すこと', () => {
    const mockGestures: GestureDefinitions = {
      ...DEFAULT_GESTURES,
      U: GestureActionType.SCROLL_UP,
    };
    vi.mocked(settingsState.getCurrentGestures).mockReturnValue(mockGestures);

    const result = settings.getGestures();

    expect(result).toEqual(mockGestures);
    expect(result).not.toBe(mockGestures); // コピーであることを確認
  });

  it('ジェスチャ定義を変更しても元の定義が変更されないこと_読み取り専用のコピーを返すこと', () => {
    const mockGestures: GestureDefinitions = { ...DEFAULT_GESTURES };
    vi.mocked(settingsState.getCurrentGestures).mockReturnValue(mockGestures);

    const result1 = settings.getGestures();
    // 型アサーションを使って一時的に書き込み可能にして変更を試みる
    (result1 as GestureDefinitions).U = GestureActionType.NONE;

    // 再度取得した定義が元の値であることを確認（独立したコピーであることを確認）
    const result2 = settings.getGestures();
    expect(result2.U).toBe(mockGestures.U);
  });
});

describe('settings.getActionForGesture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('定義済みのジェスチャパスを指定する場合_対応するアクションIDを返すこと', () => {
    const mockGestures: GestureDefinitions = {
      U: GestureActionType.SCROLL_UP,
      D: GestureActionType.SCROLL_DOWN,
    };
    vi.mocked(settingsState.getCurrentGestures).mockReturnValue(mockGestures);

    const result = settings.getActionForGesture('U');

    expect(result).toBe(GestureActionType.SCROLL_UP);
  });

  it('未定義のジェスチャパスを指定する場合_NONEを返すこと', () => {
    const mockGestures: GestureDefinitions = {
      U: GestureActionType.SCROLL_UP,
    };
    vi.mocked(settingsState.getCurrentGestures).mockReturnValue(mockGestures);

    const result = settings.getActionForGesture('XYZ');

    expect(result).toBe(GestureActionType.NONE);
  });

  it('空文字列のジェスチャパスを指定する場合_NONEを返すこと', () => {
    const mockGestures: GestureDefinitions = {
      U: GestureActionType.SCROLL_UP,
    };
    vi.mocked(settingsState.getCurrentGestures).mockReturnValue(mockGestures);

    const result = settings.getActionForGesture('');

    expect(result).toBe(GestureActionType.NONE);
  });

  it('複数文字のジェスチャパスを指定する場合_対応するアクションIDを返すこと', () => {
    const mockGestures: GestureDefinitions = {
      UL: GestureActionType.PREVIOUS_TAB,
      LR: GestureActionType.RELOAD,
    };
    vi.mocked(settingsState.getCurrentGestures).mockReturnValue(mockGestures);

    const result = settings.getActionForGesture('LR');

    expect(result).toBe(GestureActionType.RELOAD);
  });
});

describe('settings.updateSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('部分的な設定更新を指定する場合_更新後の設定値を返すこと', async () => {
    const initialSettings: Settings = { ...DEFAULT_SETTINGS };
    const updatedSettings: Settings = {
      ...DEFAULT_SETTINGS,
      enableGestures: false,
      trailColor: '#00FF00',
    };
    vi.mocked(settingsState.getCurrentSettings).mockReturnValue(initialSettings);
    vi.mocked(settingsState.updateCurrentSettings).mockReturnValue(updatedSettings);
    vi.mocked(settingsStorage.saveSettingsToStorage).mockResolvedValue(undefined);

    const result = await settings.updateSettings({
      enableGestures: false,
      trailColor: '#00FF00',
    });

    expect(settingsState.updateCurrentSettings).toHaveBeenCalledWith({
      enableGestures: false,
      trailColor: '#00FF00',
    });
    expect(settingsStorage.saveSettingsToStorage).toHaveBeenCalledOnce();
    expect(result).toEqual(updatedSettings);
    expect(result).not.toBe(updatedSettings); // コピーであることを確認
  });

  it('全ての設定項目を更新する場合_更新後の設定値を返すこと', async () => {
    const updatedSettings: Settings = {
      enableGestures: false,
      enableDrag: false,
      trailColor: '#0000FF',
      trailWidth: 8,
      minGestureDistance: 20,
      searchEngineUrl: 'https://example.com/search?q=%s',
    };
    vi.mocked(settingsState.updateCurrentSettings).mockReturnValue(updatedSettings);
    vi.mocked(settingsStorage.saveSettingsToStorage).mockResolvedValue(undefined);

    const result = await settings.updateSettings(updatedSettings);

    expect(settingsState.updateCurrentSettings).toHaveBeenCalledWith(updatedSettings);
    expect(settingsStorage.saveSettingsToStorage).toHaveBeenCalledOnce();
    expect(result).toEqual(updatedSettings);
  });

  it('空の更新オブジェクトを指定する場合_現在の設定値を返すこと', async () => {
    const currentSettings: Settings = { ...DEFAULT_SETTINGS };
    vi.spyOn(settingsState, 'updateCurrentSettings').mockReturnValue(currentSettings);
    vi.mocked(settingsStorage.saveSettingsToStorage).mockResolvedValue(undefined);

    const result = await settings.updateSettings({});

    expect(settingsState.updateCurrentSettings).toHaveBeenCalledWith({});
    expect(settingsStorage.saveSettingsToStorage).toHaveBeenCalledOnce();
    expect(result).toEqual(currentSettings);
  });

  it('ストレージ保存が失敗する場合_エラーをスローすること', async () => {
    const updatedSettings: Settings = { ...DEFAULT_SETTINGS };
    vi.spyOn(settingsState, 'updateCurrentSettings').mockReturnValue(updatedSettings);
    vi.mocked(settingsStorage.saveSettingsToStorage).mockRejectedValueOnce(new Error('ストレージ保存エラー'));

    await expect(settings.updateSettings({ enableGestures: false })).rejects.toThrow('ストレージ保存エラー');
    expect(settingsStorage.saveSettingsToStorage).toHaveBeenCalledOnce();
  });
});

describe('settings.updateGestures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('部分的なジェスチャ定義更新を指定する場合_更新後のジェスチャ定義を返すこと', async () => {
    const initialGestures: GestureDefinitions = { ...DEFAULT_GESTURES };
    const updatedGestures: GestureDefinitions = {
      ...DEFAULT_GESTURES,
      U: GestureActionType.SCROLL_UP,
      NEW: GestureActionType.NEW_TAB,
    };
    vi.mocked(settingsState.getCurrentGestures).mockReturnValue(initialGestures);
    vi.mocked(settingsState.updateCurrentGestures).mockReturnValue(updatedGestures);
    vi.mocked(settingsStorage.saveGesturesToStorage).mockResolvedValue(undefined);

    const result = await settings.updateGestures({
      U: GestureActionType.SCROLL_UP,
      NEW: GestureActionType.NEW_TAB,
    });

    expect(settingsState.updateCurrentGestures).toHaveBeenCalledWith({
      U: GestureActionType.SCROLL_UP,
      NEW: GestureActionType.NEW_TAB,
    });
    expect(settingsStorage.saveGesturesToStorage).toHaveBeenCalledOnce();
    expect(result).toEqual(updatedGestures);
    expect(result).not.toBe(updatedGestures); // コピーであることを確認
  });

  it('全てのジェスチャ定義を更新する場合_更新後のジェスチャ定義を返すこと', async () => {
    const updatedGestures: GestureDefinitions = {
      U: GestureActionType.SCROLL_UP,
      D: GestureActionType.SCROLL_DOWN,
    };
    vi.mocked(settingsState.updateCurrentGestures).mockReturnValue(updatedGestures);
    vi.mocked(settingsStorage.saveGesturesToStorage).mockResolvedValue(undefined);

    const result = await settings.updateGestures(updatedGestures);

    expect(settingsState.updateCurrentGestures).toHaveBeenCalledWith(updatedGestures);
    expect(settingsStorage.saveGesturesToStorage).toHaveBeenCalledOnce();
    expect(result).toEqual(updatedGestures);
  });

  it('空の更新オブジェクトを指定する場合_現在のジェスチャ定義を返すこと', async () => {
    const currentGestures: GestureDefinitions = { ...DEFAULT_GESTURES };
    vi.spyOn(settingsState, 'updateCurrentGestures').mockReturnValue(currentGestures);
    vi.mocked(settingsStorage.saveGesturesToStorage).mockResolvedValue(undefined);

    const result = await settings.updateGestures({});

    expect(settingsState.updateCurrentGestures).toHaveBeenCalledWith({});
    expect(settingsStorage.saveGesturesToStorage).toHaveBeenCalledOnce();
    expect(result).toEqual(currentGestures);
  });

  it('ストレージ保存が失敗する場合_エラーをスローすること', async () => {
    const updatedGestures: GestureDefinitions = { ...DEFAULT_GESTURES };
    vi.spyOn(settingsState, 'updateCurrentGestures').mockReturnValue(updatedGestures);
    vi.mocked(settingsStorage.saveGesturesToStorage).mockRejectedValueOnce(new Error('ストレージ保存エラー'));

    await expect(settings.updateGestures({ U: GestureActionType.SCROLL_UP })).rejects.toThrow('ストレージ保存エラー');
    expect(settingsStorage.saveGesturesToStorage).toHaveBeenCalledOnce();
  });
});

describe('settings.onSettingsChange', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('リスナーを登録する場合_削除関数を返すこと', () => {
    const mockUnsubscribe = vi.fn();
    vi.mocked(settingsState.addSettingsChangeListener).mockReturnValue(mockUnsubscribe);

    const listener = vi.fn();
    const unsubscribe = settings.onSettingsChange(listener);

    expect(settingsState.addSettingsChangeListener).toHaveBeenCalledWith(listener);
    expect(unsubscribe).toBe(mockUnsubscribe);
  });

  it('複数のリスナーを登録する場合_それぞれ独立した削除関数を返すこと', () => {
    const mockUnsubscribe1 = vi.fn();
    const mockUnsubscribe2 = vi.fn();
    vi.mocked(settingsState.addSettingsChangeListener)
      .mockReturnValueOnce(mockUnsubscribe1)
      .mockReturnValueOnce(mockUnsubscribe2);

    const listener1 = vi.fn();
    const listener2 = vi.fn();
    const unsubscribe1 = settings.onSettingsChange(listener1);
    const unsubscribe2 = settings.onSettingsChange(listener2);

    expect(settingsState.addSettingsChangeListener).toHaveBeenCalledTimes(2);
    expect(unsubscribe1).toBe(mockUnsubscribe1);
    expect(unsubscribe2).toBe(mockUnsubscribe2);
  });

  it('削除関数を呼び出す場合_リスナーが削除されること', () => {
    const mockUnsubscribe = vi.fn();
    vi.mocked(settingsState.addSettingsChangeListener).mockReturnValue(mockUnsubscribe);

    const listener = vi.fn();
    const unsubscribe = settings.onSettingsChange(listener);

    unsubscribe();

    expect(mockUnsubscribe).toHaveBeenCalledOnce();
  });
});

describe('settings.onGesturesChange', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('リスナーを登録する場合_削除関数を返すこと', () => {
    const mockUnsubscribe = vi.fn();
    vi.mocked(settingsState.addGesturesChangeListener).mockReturnValue(mockUnsubscribe);

    const listener = vi.fn();
    const unsubscribe = settings.onGesturesChange(listener);

    expect(settingsState.addGesturesChangeListener).toHaveBeenCalledWith(listener);
    expect(unsubscribe).toBe(mockUnsubscribe);
  });

  it('複数のリスナーを登録する場合_それぞれ独立した削除関数を返すこと', () => {
    const mockUnsubscribe1 = vi.fn();
    const mockUnsubscribe2 = vi.fn();
    vi.mocked(settingsState.addGesturesChangeListener)
      .mockReturnValueOnce(mockUnsubscribe1)
      .mockReturnValueOnce(mockUnsubscribe2);

    const listener1 = vi.fn();
    const listener2 = vi.fn();
    const unsubscribe1 = settings.onGesturesChange(listener1);
    const unsubscribe2 = settings.onGesturesChange(listener2);

    expect(settingsState.addGesturesChangeListener).toHaveBeenCalledTimes(2);
    expect(unsubscribe1).toBe(mockUnsubscribe1);
    expect(unsubscribe2).toBe(mockUnsubscribe2);
  });

  it('削除関数を呼び出す場合_リスナーが削除されること', () => {
    const mockUnsubscribe = vi.fn();
    vi.mocked(settingsState.addGesturesChangeListener).mockReturnValue(mockUnsubscribe);

    const listener = vi.fn();
    const unsubscribe = settings.onGesturesChange(listener);

    unsubscribe();

    expect(mockUnsubscribe).toHaveBeenCalledOnce();
  });
});

