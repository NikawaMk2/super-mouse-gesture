/**
 * 設定管理の型定義とデフォルト値
 * 
 * Chrome拡張機能「Super Mouse Gesture」の設定値の型定義と
 * デフォルト値を定義する。
 */

import type { GestureActionType } from '../../types/gesture-action';

/**
 * 設定オブジェクトの型定義
 */
export interface Settings {
  /** マウスジェスチャ機能の有効/無効 */
  enableGestures: boolean;
  /** スーパードラッグ機能の有効/無効 */
  enableDrag: boolean;
  /** ジェスチャトレイルの色 (HEX) */
  trailColor: string;
  /** ジェスチャトレイルの太さ (px) */
  trailWidth: number;
  /** ジェスチャ方向判定の最小移動距離 (px) */
  minGestureDistance: number;
  /** スーパードラッグ検索用URLテンプレート */
  searchEngineUrl: string;
}

/**
 * ジェスチャ定義の型定義
 * ジェスチャパス文字列をキーとし、アクションIDを値とするマップ
 */
export type GestureDefinitions = Record<string, GestureActionType>;

/**
 * 設定変更リスナーの型定義
 */
export type SettingsChangeListener = (settings: Settings) => void;

/**
 * ジェスチャ定義変更リスナーの型定義
 */
export type GesturesChangeListener = (gestures: GestureDefinitions) => void;

/**
 * デフォルト設定値
 */
export const DEFAULT_SETTINGS: Settings = {
  enableGestures: true,
  enableDrag: true,
  trailColor: '#FF4081',
  trailWidth: 4,
  minGestureDistance: 10,
  searchEngineUrl: 'https://www.google.com/search?q=%s',
};

/**
 * デフォルトジェスチャ定義
 */
export const DEFAULT_GESTURES: GestureDefinitions = {
  U: 'scroll-up',
  D: 'scroll-down',
  L: 'go-back',
  R: 'go-forward',
  UL: 'previous-tab',
  UR: 'next-tab',
  DL: 'close-tab-and-go-left',
  DR: 'close-tab-and-go-right',
  LU: 'zoom-in',
  LD: 'zoom-out',
  RU: 'new-tab',
  RD: 'toggle-fullscreen',
  DU: 'scroll-to-top',
  UD: 'scroll-to-bottom',
  LR: 'reload',
  RL: 'restore-tab',
};

/**
 * ストレージキー
 */
export const STORAGE_KEYS = {
  SETTINGS: 'settings',
  GESTURES: 'gestures',
} as const;

