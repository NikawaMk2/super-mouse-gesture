/**
 * 設定管理のストレージ操作
 * 
 * `chrome.storage.local` を使用した設定の読み込み・保存と、
 * ストレージ変更イベントの監視を担当する。
 */

import { logger } from '../../logger';
import type {
  Settings,
  GestureDefinitions,
} from './settings-types';
import { STORAGE_KEYS } from './settings-types';
import {
  mergeSettings,
  mergeGestures,
  getCurrentSettings,
  getCurrentGestures,
  setCurrentSettings,
  setCurrentGestures,
  notifySettingsChangeListeners,
  notifyGesturesChangeListeners,
} from './settings-state';

/**
 * ストレージから設定を読み込む
 */
export async function loadSettingsFromStorage(): Promise<void> {
  try {
    const result = await chrome.storage.local.get([
      STORAGE_KEYS.SETTINGS,
      STORAGE_KEYS.GESTURES,
    ]);

    // 設定を読み込み
    if (result[STORAGE_KEYS.SETTINGS]) {
      const settings = mergeSettings(result[STORAGE_KEYS.SETTINGS] as Partial<Settings>);
      setCurrentSettings(settings);
    } else {
      // 初回起動時はデフォルト値を保存
      await saveSettingsToStorage();
    }

    // ジェスチャ定義を読み込み
    if (result[STORAGE_KEYS.GESTURES]) {
      const gestures = mergeGestures(result[STORAGE_KEYS.GESTURES] as Partial<GestureDefinitions>);
      setCurrentGestures(gestures);
    } else {
      // 初回起動時はデフォルト値を保存
      await saveGesturesToStorage();
    }

    logger.debug('settings', '設定を読み込みました', {
      settings: getCurrentSettings(),
      gestures: getCurrentGestures(),
    });
  } catch (error) {
    logger.error('settings', '設定の読み込みに失敗しました', error);
    throw error;
  }
}

/**
 * ストレージに設定を保存する
 */
export async function saveSettingsToStorage(): Promise<void> {
  try {
    await chrome.storage.local.set({
      [STORAGE_KEYS.SETTINGS]: getCurrentSettings(),
    });
    logger.debug('settings', '設定を保存しました', getCurrentSettings());
  } catch (error) {
    logger.error('settings', '設定の保存に失敗しました', error);
    throw error;
  }
}

/**
 * ストレージにジェスチャ定義を保存する
 */
export async function saveGesturesToStorage(): Promise<void> {
  try {
    await chrome.storage.local.set({
      [STORAGE_KEYS.GESTURES]: getCurrentGestures(),
    });
    logger.debug('settings', 'ジェスチャ定義を保存しました', getCurrentGestures());
  } catch (error) {
    logger.error('settings', 'ジェスチャ定義の保存に失敗しました', error);
    throw error;
  }
}

/**
 * ストレージ変更イベントを監視する
 */
export function setupStorageListener(): void {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') {
      return;
    }

    // 設定の変更を検知
    handleSettingsChange(changes);
    // ジェスチャ定義の変更を検知
    handleGesturesChange(changes);
  });
}

/**
 * 設定変更を処理する
 * @param changes - ストレージ変更イベントの変更内容
 */
function handleSettingsChange(changes: Record<string, chrome.storage.StorageChange>): void {
  const settingsChange = changes[STORAGE_KEYS.SETTINGS];
  if (!settingsChange) {
    return;
  }

  const newValue = settingsChange.newValue as Partial<Settings> | undefined;
  if (!newValue) {
    return;
  }

  const settings = mergeSettings(newValue);
  setCurrentSettings(settings);
  // リスナーに通知
  try {
    notifySettingsChangeListeners(settings);
  } catch (error) {
    logger.error('settings', '設定変更リスナーの実行に失敗しました', error);
  }
  logger.debug('settings', '設定が変更されました', settings);
}

/**
 * ジェスチャ定義変更を処理する
 * @param changes - ストレージ変更イベントの変更内容
 */
function handleGesturesChange(changes: Record<string, chrome.storage.StorageChange>): void {
  const gesturesChange = changes[STORAGE_KEYS.GESTURES];
  if (!gesturesChange) {
    return;
  }

    const newValue = gesturesChange.newValue as Partial<GestureDefinitions> | undefined;
    if (!newValue) {
      return;
    }

    const gestures = mergeGestures(newValue);
    setCurrentGestures(gestures);
    // リスナーに通知
    try {
      notifyGesturesChangeListeners(gestures);
    } catch (error) {
      logger.error('settings', 'ジェスチャ定義変更リスナーの実行に失敗しました', error);
    }
  logger.debug('settings', 'ジェスチャ定義が変更されました', gestures);
}
