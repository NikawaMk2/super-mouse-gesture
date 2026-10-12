import { logger } from '@/shared/logger';
import { sendMessageWithRetry } from '@/shared/utils/message-sender';
import { GestureActionEvent } from './gesture_action';

/**
 * タブを閉じて右へアクション
 */
export const closeTabAndGoRightAction: GestureActionEvent = {
  execute(): void {
    logger.debug('CloseTabAndGoRightAction', 'タブを閉じて右へ');

    sendMessageWithRetry({
      type: 'CLOSE_TAB_AND_GO_RIGHT',
      payload: null,
    }).catch((error) => {
      logger.error('CloseTabAndGoRightAction', 'メッセージ送信エラー', error);
    });
  },
};

