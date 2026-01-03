import { startTrail, addTrailPoint, endTrail } from './visual/visual-trail';
import { showActionName, hideActionName, cleanupActionName } from './visual/visual-action-name';

// トレイル描画関連の関数を再エクスポート
export { startTrail, addTrailPoint, endTrail };

// アクション名表示関連の関数を再エクスポート
export { showActionName, hideActionName };

/**
 * すべての描画要素を削除する（クリーンアップ）
 * 
 * トレイル描画とアクション名表示の両方をクリーンアップする。
 */
export function cleanup(): void {
  endTrail();
  cleanupActionName();
}
