import { logger } from '@/shared/logger';
import { sendMessageWithRetry } from '@/shared/utils/message-sender';
import { GestureActionEvent } from './gesture_action';

/**
 * タブ復元アクション
 */
export const restoreTabAction: GestureActionEvent = {
  execute(): void {
    logger.debug('RestoreTabAction', 'タブを復元');

    sendMessageWithRetry({
      type: 'RESTORE_TAB',
      payload: null,
    }).catch((error) => {
      logger.error('RestoreTabAction', 'メッセージ送信エラー', error);
    });
  },
};

