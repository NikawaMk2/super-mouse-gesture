import { logger } from '@/shared/logger';
import { GestureActionEvent } from './gesture_action';

/**
 * ページ縮小アクション
 */
export const zoomOutAction: GestureActionEvent = {
  execute(): void {
    logger.debug('ZoomOutAction', 'ページ縮小');

    chrome.runtime.sendMessage({
      type: 'ZOOM_OUT',
      payload: null,
    }).catch((error) => {
      logger.error('ZoomOutAction', 'メッセージ送信エラー', error);
    });
  },
};

