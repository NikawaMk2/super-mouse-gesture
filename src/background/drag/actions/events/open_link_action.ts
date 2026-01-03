import { logger } from "@/shared/logger";
import { OpenNewTabPayload } from "@/shared/types/extension-message";
import { BackgroundAction } from "../../../gestures/actions/events/background_action";

/**
 * リンクを開くアクション
 */
export const openLinkAction: BackgroundAction = {
  async execute(payload?: unknown) {
    const openPayload = payload as OpenNewTabPayload | undefined;

    if (!openPayload?.url) {
      logger.warn('OpenLinkAction', 'URLが指定されていません');
      return;
    }

    logger.debug('OpenLinkAction', 'リンクを新しいタブで開く', { url: openPayload.url });

    await chrome.tabs.create({
      url: openPayload.url,
      active: openPayload.active ?? true,
    });
  },
};

