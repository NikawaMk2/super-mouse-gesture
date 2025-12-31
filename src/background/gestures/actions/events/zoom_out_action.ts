import { logger } from "@/shared/logger";
import { BackgroundAction } from "./background_action";

/**
 * ページ縮小アクション
 */
export const zoomOutAction: BackgroundAction = {
  async execute() {
    logger.debug('BackgroundAction', 'ページ縮小');
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs) return;
    if (tabs.length === 0) return;
    if (!tabs[0]?.id) return;

    const tabId = tabs[0].id;
    const currentZoom = await chrome.tabs.getZoom(tabId);
    await chrome.tabs.setZoom(tabId, Math.max(currentZoom - 0.1, 0.25));
  },
};

