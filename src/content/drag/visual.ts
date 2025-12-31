import { showActionName, hideActionName, cleanupActionName } from './visual/visual-action-name';

// アクション名表示関連の関数を再エクスポート
export { showActionName, hideActionName };

/**
 * すべての描画要素を削除する（クリーンアップ）
 * 
 * アクション名表示をクリーンアップする。
 */
export function cleanup(): void {
  cleanupActionName();
}

