import { logger } from '@/shared/logger';
import { sendMessageWithRetry } from '@/shared/utils/message-sender';
import { GestureActionEvent } from './gesture_action';

/**
 * 次のタブへアクション
 */
export const nextTabAction: GestureActionEvent = {
  execute(): void {
    logger.debug('NextTabAction', '次のタブへ切り替え');

    sendMessageWithRetry({
      type: 'TAB_NEXT',
      payload: null,
    }).catch((error) => {
      logger.error('NextTabAction', 'メッセージ送信エラー', error);
    });
  },
};

