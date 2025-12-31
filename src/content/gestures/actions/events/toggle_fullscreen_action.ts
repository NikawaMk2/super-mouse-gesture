import { logger } from '../../../shared/logger';
import { GestureActionEvent } from './gesture_action';

/**
 * フルスクリーン切り替えアクション
 */
export const toggleFullscreenAction: GestureActionEvent = {
  execute(): void {
    logger.debug('ToggleFullscreenAction', 'フルスクリーン切り替え');

    if (isFullscreen()) {
      document.exitFullscreen().catch((error) => {
        logger.error('ToggleFullscreenAction', 'フルスクリーン終了エラー', error);
      });
    } else {
      document.documentElement.requestFullscreen().catch((error) => {
        logger.error('ToggleFullscreenAction', 'フルスクリーン開始エラー', error);
      });
    }
  },
};

/**
 * フルスクリーン状態を確認する
 * @returns フルスクリーン状態
 */
function isFullscreen(): boolean {
  return document.fullscreenElement !== null;
}
