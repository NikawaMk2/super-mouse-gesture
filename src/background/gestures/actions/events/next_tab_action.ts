import { logger } from "@/shared/logger";
import { BackgroundAction } from "./background_action";

/**
 * 次のタブへ切り替えアクション
 */
export const nextTabAction: BackgroundAction = {
  async execute() {
    logger.debug('BackgroundAction', '次のタブへ切り替え');
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const currentTab = tabs.find((tab) => tab.active);
    if (!currentTab) return;
    if (!currentTab.index) return;

    const nextTab = tabs.find((tab) => tab.index === currentTab.index + 1);
    if (!nextTab) return;
    if (!nextTab.id) return;

    await chrome.tabs.update(nextTab.id, { active: true });
  },
};

