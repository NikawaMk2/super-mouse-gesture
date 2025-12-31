import { logger } from '../../../shared/logger';
import { GestureActionEvent } from './gesture_action';

/**
 * 新規タブアクション
 */
export const newTabAction: GestureActionEvent = {
  execute(): void {
    logger.debug('NewTabAction', '新規タブを開く');

    chrome.runtime.sendMessage({
      type: 'OPEN_NEW_TAB',
      payload: null,
    }).catch((error) => {
      logger.error('NewTabAction', 'メッセージ送信エラー', error);
    });
  },
};

