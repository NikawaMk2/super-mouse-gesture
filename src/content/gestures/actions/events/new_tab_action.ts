import { logger } from '@/shared/logger';
import { sendMessageWithRetry } from '@/shared/utils/message-sender';
import { GestureActionEvent } from './gesture_action';

/**
 * 新規タブアクション
 */
export const newTabAction: GestureActionEvent = {
  execute(): void {
    logger.debug('NewTabAction', '新規タブを開く');

    sendMessageWithRetry({
      type: 'OPEN_NEW_TAB',
      payload: null,
    }).catch((error) => {
      logger.error('NewTabAction', 'メッセージ送信エラー', error);
    });
  },
};

