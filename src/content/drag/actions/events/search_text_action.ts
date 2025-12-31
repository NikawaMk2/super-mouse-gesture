import { logger } from '@/shared/logger';
import { ExtensionMessageType, SearchTextPayload } from '@/shared/types/extension-message';
import { DragActionEvent } from './drag_action';

/**
 * テキスト検索アクション
 */
export const searchTextAction: DragActionEvent = {
  execute(text?: string): void {
    if (!text || text.trim().length === 0) {
      logger.warn('SearchTextAction', '検索テキストが指定されていません');
      return;
    }

    const searchText = text.trim();
    logger.debug('SearchTextAction', 'テキストを検索', { text: searchText });

    const payload: SearchTextPayload = {
      text: searchText,
    };

    chrome.runtime.sendMessage({
      type: ExtensionMessageType.DRAG_SEARCH_TEXT,
      payload,
    }).catch((error) => {
      logger.error('SearchTextAction', 'メッセージ送信エラー', error);
    });
  },
};

