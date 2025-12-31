/**
 * 設定管理の状態管理
 * 
 * 設定値とジェスチャ定義の状態管理、マージ処理、リスナー管理を担当する。
 */

import type {
  Settings,
  GestureDefinitions,
  SettingsChangeListener,
  GesturesChangeListener,
} from './settings-types';
import {
  DEFAULT_SETTINGS,
  DEFAULT_GESTURES,
} from './settings-types';

/**
 * 現在の設定値（モジュールスコープ）
 */
let currentSettings: Settings = { ...DEFAULT_SETTINGS };

/**
 * 現在のジェスチャ定義（モジュールスコープ）
 */
let currentGestures: GestureDefinitions = { ...DEFAULT_GESTURES };

/**
 * 設定変更リスナーのリスト
 */
const settingsChangeListeners: Set<SettingsChangeListener> = new Set();

/**
 * ジェスチャ定義変更リスナーのリスト
 */
const gesturesChangeListeners: Set<GesturesChangeListener> = new Set();

/**
 * 設定をマージする（デフォルト値で不足している項目を補完）
 */
export function mergeSettings(loaded: Partial<Settings>): Settings {
  return {
    ...DEFAULT_SETTINGS,
    ...loaded,
  };
}

/**
 * ジェスチャ定義をマージする（デフォルト値で不足している項目を補完）
 */
export function mergeGestures(loaded: Partial<GestureDefinitions>): GestureDefinitions {
  const merged: GestureDefinitions = { ...DEFAULT_GESTURES };
  // undefined でない値のみをマージ
  for (const [key, value] of Object.entries(loaded)) {
    if (value !== undefined) {
      merged[key] = value;
    }
  }
  return merged;
}

/**
 * 現在の設定値を取得する（内部用）
 */
export function getCurrentSettings(): Settings {
  return currentSettings;
}

/**
 * 現在のジェスチャ定義を取得する（内部用）
 */
export function getCurrentGestures(): GestureDefinitions {
  return currentGestures;
}

/**
 * 設定値を更新する（内部用）
 */
export function setCurrentSettings(settings: Settings): void {
  currentSettings = settings;
}

/**
 * ジェスチャ定義を更新する（内部用）
 */
export function setCurrentGestures(gestures: GestureDefinitions): void {
  currentGestures = gestures;
}

/**
 * 設定値を更新する（内部用）
 */
export function updateCurrentSettings(updates: Partial<Settings>): Settings {
  currentSettings = mergeSettings({ ...currentSettings, ...updates });
  return currentSettings;
}

/**
 * ジェスチャ定義を更新する（内部用）
 */
export function updateCurrentGestures(updates: Partial<GestureDefinitions>): GestureDefinitions {
  currentGestures = mergeGestures({ ...currentGestures, ...updates });
  return currentGestures;
}

/**
 * 設定変更のリスナーを登録する（内部用）
 */
export function addSettingsChangeListener(listener: SettingsChangeListener): () => void {
  settingsChangeListeners.add(listener);
  return () => {
    settingsChangeListeners.delete(listener);
  };
}

/**
 * ジェスチャ定義変更のリスナーを登録する（内部用）
 */
export function addGesturesChangeListener(listener: GesturesChangeListener): () => void {
  gesturesChangeListeners.add(listener);
  return () => {
    gesturesChangeListeners.delete(listener);
  };
}

/**
 * 設定変更のリスナーを全て呼び出す（内部用）
 */
export function notifySettingsChangeListeners(settings: Settings): void {
  settingsChangeListeners.forEach((listener) => {
    try {
      listener(settings);
    } catch (error) {
      // エラーハンドリングは呼び出し元で行う
      throw error;
    }
  });
}

/**
 * ジェスチャ定義変更のリスナーを全て呼び出す（内部用）
 */
export function notifyGesturesChangeListeners(gestures: GestureDefinitions): void {
  gesturesChangeListeners.forEach((listener) => {
    try {
      listener(gestures);
    } catch (error) {
      // エラーハンドリングは呼び出し元で行う
      throw error;
    }
  });
}

