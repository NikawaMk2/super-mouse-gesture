import { logger } from '@/shared/logger';
import { sendMessageWithRetry } from '@/shared/utils/message-sender';
import { GestureActionEvent } from './gesture_action';

/**
 * 前のタブへアクション
 */
export const previousTabAction: GestureActionEvent = {
  execute(): void {
    logger.debug('PreviousTabAction', '前のタブへ切り替え');

    sendMessageWithRetry({
      type: 'TAB_PREV',
      payload: null,
    }).catch((error) => {
      logger.error('PreviousTabAction', 'メッセージ送信エラー', error);
    });
  },
};

