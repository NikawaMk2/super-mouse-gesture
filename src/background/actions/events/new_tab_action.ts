import { logger } from "@/shared/logger";
import { BackgroundAction } from "./background_action";

/**
 * 新規タブを開くアクション
 */
export const newTabAction: BackgroundAction = {
  async execute(_payload?: unknown) {
    logger.debug('BackgroundAction', '新規タブを開く');

    await chrome.tabs.create({ url: 'chrome://newtab/', active: true });
  },
};

