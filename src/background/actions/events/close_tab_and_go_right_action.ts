import { logger } from "@/shared/logger";
import { BackgroundAction } from "./background_action";

/**
 * タブを閉じて右へアクション
 */
export const closeTabAndGoRightAction: BackgroundAction = {
  async execute() {
    logger.debug('BackgroundAction', 'タブを閉じて右へ');
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const currentTab = tabs.find((tab) => tab.active);
    if (!currentTab) return;
    if (!currentTab.id) return;
    if (currentTab.index === undefined) return;

    const nextTab = tabs.find((tab) => tab.index === currentTab.index + 1);
    if (!nextTab) return;
    if (!nextTab.id) return;

    await chrome.tabs.update(nextTab.id, { active: true });
    await chrome.tabs.remove(currentTab.id);
  },
};
