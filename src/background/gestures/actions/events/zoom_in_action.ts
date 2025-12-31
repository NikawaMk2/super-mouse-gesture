import { logger } from "@/shared/logger";
import { BackgroundAction } from "./background_action";

/**
 * ページ拡大アクション
 */
export const zoomInAction: BackgroundAction = {
  async execute() {
    logger.debug('BackgroundAction', 'ページ拡大');
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs) return;
    if (tabs.length === 0) return;
    if (!tabs[0]?.id) return;

    const tabId = tabs[0].id;
    const currentZoom = await chrome.tabs.getZoom(tabId);
    await chrome.tabs.setZoom(tabId, Math.min(currentZoom + 0.1, 5.0));
  },
};

