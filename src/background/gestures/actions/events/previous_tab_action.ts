import { logger } from "@/shared/logger";
import { BackgroundAction } from "./background_action";

/**
 * 前のタブへ切り替えアクション
 */
export const previousTabAction: BackgroundAction = {
  async execute() {
    logger.debug('BackgroundAction', '前のタブへ切り替え');
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const currentTab = tabs.find((tab) => tab.active);
    if (!currentTab) return;
    if (!currentTab.index) return;

    const prevTab = tabs.find((tab) => tab.index === currentTab.index - 1);
    if (!prevTab) return;
    if (!prevTab.id) return;

    await chrome.tabs.update(prevTab.id, { active: true });
  },
};

