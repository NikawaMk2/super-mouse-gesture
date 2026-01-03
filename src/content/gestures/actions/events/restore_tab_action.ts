import { logger } from '@/shared/logger';
import { GestureActionEvent } from './gesture_action';

/**
 * タブ復元アクション
 */
export const restoreTabAction: GestureActionEvent = {
  execute(): void {
    logger.debug('RestoreTabAction', 'タブを復元');

    chrome.runtime.sendMessage({
      type: 'RESTORE_TAB',
      payload: null,
    }).catch((error) => {
      logger.error('RestoreTabAction', 'メッセージ送信エラー', error);
    });
  },
};

