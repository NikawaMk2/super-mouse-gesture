import { logger } from '@/shared/logger';
import { GestureActionEvent } from './gesture_action';

/**
 * 次のタブへアクション
 */
export const nextTabAction: GestureActionEvent = {
  execute(): void {
    logger.debug('NextTabAction', '次のタブへ切り替え');

    chrome.runtime.sendMessage({
      type: 'TAB_NEXT',
      payload: null,
    }).catch((error) => {
      logger.error('NextTabAction', 'メッセージ送信エラー', error);
    });
  },
};

