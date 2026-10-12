import { logger } from '@/shared/logger';
import { sendMessageWithRetry } from '@/shared/utils/message-sender';
import { GestureActionEvent } from './gesture_action';

/**
 * ページ縮小アクション
 */
export const zoomOutAction: GestureActionEvent = {
  execute(): void {
    logger.debug('ZoomOutAction', 'ページ縮小');

    sendMessageWithRetry({
      type: 'ZOOM_OUT',
      payload: null,
    }).catch((error) => {
      logger.error('ZoomOutAction', 'メッセージ送信エラー', error);
    });
  },
};

