import { logger } from "@/shared/logger";
import { BackgroundAction } from "./background_action";

/**
 * タブを閉じて左へアクション
 */
export const closeTabAndGoLeftAction: BackgroundAction = {
  async execute() {
    logger.debug('BackgroundAction', 'タブを閉じて左へ');
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const currentTab = tabs.find((tab) => tab.active);
    if (!currentTab) return;
    if (!currentTab.id) return;
    if (currentTab.index === undefined) return;

    const prevTab = tabs.find((tab) => tab.index === currentTab.index - 1);
    if (!prevTab) return;
    if (!prevTab.id) return;

    await chrome.tabs.update(prevTab.id, { active: true });
    await chrome.tabs.remove(currentTab.id);
  },
};

