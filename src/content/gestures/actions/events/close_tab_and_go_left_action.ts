import { logger } from '@/shared/logger';
import { GestureActionEvent } from './gesture_action';

/**
 * タブを閉じて左へアクション
 */
export const closeTabAndGoLeftAction: GestureActionEvent = {
  execute(): void {
    logger.debug('CloseTabAndGoLeftAction', 'タブを閉じて左へ');

    chrome.runtime.sendMessage({
      type: 'CLOSE_TAB_AND_GO_LEFT',
      payload: null,
    }).catch((error) => {
      logger.error('CloseTabAndGoLeftAction', 'メッセージ送信エラー', error);
    });
  },
};

