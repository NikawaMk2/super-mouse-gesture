import { logger } from "@/shared/logger";
import { SearchTextPayload } from "@/shared/types/extension-message";
import { BackgroundAction } from "../../../gestures/actions/events/background_action";

/**
 * テキスト検索アクション
 */
export const searchTextAction: BackgroundAction = {
  async execute(payload?: unknown) {
    const searchPayload = payload as SearchTextPayload | undefined;

    if (!searchPayload?.text || searchPayload.text.trim().length === 0) {
      logger.warn('SearchTextAction', '検索テキストが指定されていません');
      return;
    }

    const searchText = searchPayload.text.trim();
    logger.debug('SearchTextAction', 'テキストを検索', { text: searchText });

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchText)}`;

    await chrome.tabs.create({
      url: searchUrl,
      active: true,
    });
  },
};

