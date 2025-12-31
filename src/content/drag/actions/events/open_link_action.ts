import { logger } from '@/shared/logger';
import { ExtensionMessageType, OpenNewTabPayload } from '@/shared/types/extension-message';
import { DragActionEvent } from './drag_action';

/**
 * リンクを開くアクション
 */
export const openLinkAction: DragActionEvent = {
  execute(url?: string): void {
    if (!url) {
      logger.warn('OpenLinkAction', 'URLが指定されていません');
      return;
    }

    logger.debug('OpenLinkAction', 'リンクを新しいタブで開く', { url });

    const payload: OpenNewTabPayload = {
      url,
      active: true,
    };

    chrome.runtime.sendMessage({
      type: ExtensionMessageType.DRAG_OPEN_LINK,
      payload,
    }).catch((error) => {
      logger.error('OpenLinkAction', 'メッセージ送信エラー', error);
    });
  },
};

