import { logger } from '@/shared/logger';
import { sendMessageWithRetry } from '@/shared/utils/message-sender';
import { GestureActionEvent } from './gesture_action';

/**
 * タブを閉じて左へアクション
 */
export const closeTabAndGoLeftAction: GestureActionEvent = {
  execute(): void {
    logger.debug('CloseTabAndGoLeftAction', 'タブを閉じて左へ');

    sendMessageWithRetry({
      type: 'CLOSE_TAB_AND_GO_LEFT',
      payload: null,
    }).catch((error) => {
      logger.error('CloseTabAndGoLeftAction', 'メッセージ送信エラー', error);
    });
  },
};

