/**
 * 設定管理ユーティリティ
 * 
 * Chrome拡張機能「Super Mouse Gesture」の設定値を取得・管理する。
 * `chrome.storage.local` を使用して設定を永続化し、
 * 設定変更を監視して動的に反映する。
 */

import { GestureActionType } from '../types/gesture-action';
import { logger } from '../logger';
import type { Settings, GestureDefinitions } from './settings/settings-types';
import {
  loadSettingsFromStorage,
  saveSettingsToStorage,
  saveGesturesToStorage,
  setupStorageListener,
} from './settings/settings-storage';
import {
  getCurrentSettings,
  getCurrentGestures,
  updateCurrentSettings,
  updateCurrentGestures,
  addSettingsChangeListener,
  addGesturesChangeListener,
} from './settings/settings-state';

/**
 * 設定管理API
 */
export const settings = {
  /**
   * 設定を初期化する
   * ストレージから設定を読み込み、変更監視を開始する。
   * 拡張機能起動時およびContent Script注入時に呼び出す。
   */
  async initialize(): Promise<void> {
    await loadSettingsFromStorage();
    setupStorageListener();
    logger.info('settings', '設定管理を初期化しました');
  },

  /**
   * 現在の設定値を取得する
   * 
   * @returns 現在の設定値（読み取り専用のコピー）
   */
  getSettings(): Readonly<Settings> {
    return { ...getCurrentSettings() };
  },

  /**
   * 現在のジェスチャ定義を取得する
   * 
   * @returns 現在のジェスチャ定義（読み取り専用のコピー）
   */
  getGestures(): Readonly<GestureDefinitions> {
    return { ...getCurrentGestures() };
  },

  /**
   * 指定されたジェスチャパスに対応するアクションIDを取得する
   * 
   * @param gesturePath ジェスチャパス（例: "U", "LR"）
   * @returns アクションID、未定義の場合は NONE
   */
  getActionForGesture(gesturePath: string): GestureActionType {
    const gestures = getCurrentGestures();
    return gestures[gesturePath] ?? GestureActionType.NONE;
  },

  /**
   * 設定値を更新する
   * 
   * @param updates 更新する設定値（部分的な更新も可能）
   * @returns 更新後の設定値
   */
  async updateSettings(updates: Partial<Settings>): Promise<Settings> {
    const updated = updateCurrentSettings(updates);
    await saveSettingsToStorage();
    return { ...updated };
  },

  /**
   * ジェスチャ定義を更新する
   * 
   * @param updates 更新するジェスチャ定義（部分的な更新も可能）
   * @returns 更新後のジェスチャ定義
   */
  async updateGestures(updates: Partial<GestureDefinitions>): Promise<GestureDefinitions> {
    const updated = updateCurrentGestures(updates);
    await saveGesturesToStorage();
    return { ...updated };
  },

  /**
   * 設定変更のリスナーを登録する
   * 
   * @param listener 設定変更時に呼び出されるコールバック関数
   * @returns リスナーを削除する関数
   */
  onSettingsChange(listener: (settings: Settings) => void): () => void {
    return addSettingsChangeListener(listener);
  },

  /**
   * ジェスチャ定義変更のリスナーを登録する
   * 
   * @param listener ジェスチャ定義変更時に呼び出されるコールバック関数
   * @returns リスナーを削除する関数
   */
  onGesturesChange(listener: (gestures: GestureDefinitions) => void): () => void {
    return addGesturesChangeListener(listener);
  },
};

// 型定義を再エクスポート
export type { Settings, GestureDefinitions } from './settings/settings-types';
