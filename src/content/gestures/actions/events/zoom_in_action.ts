import { logger } from '@/shared/logger';
import { sendMessageWithRetry } from '@/shared/utils/message-sender';
import { GestureActionEvent } from './gesture_action';

/**
 * ページ拡大アクション
 */
export const zoomInAction: GestureActionEvent = {
  execute(): void {
    logger.debug('ZoomInAction', 'ページ拡大');

    sendMessageWithRetry({
      type: 'ZOOM_IN',
      payload: null,
    }).catch((error) => {
      logger.error('ZoomInAction', 'メッセージ送信エラー', error);
    });
  },
};

