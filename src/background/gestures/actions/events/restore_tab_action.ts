import { logger } from "@/shared/logger";
import { BackgroundAction } from "./background_action";

/**
 * タブを復元アクション
 */
export const restoreTabAction: BackgroundAction = {
  async execute() {
    logger.debug('BackgroundAction', 'タブを復元');
    const sessions = await chrome.sessions.getRecentlyClosed({ maxResults: 1 });
    if (!sessions) return;
    if (sessions.length === 0) return;
    if (!sessions[0]?.tab) return;
    if (!sessions[0]?.tab?.sessionId) return;

    await chrome.sessions.restore(sessions[0].tab.sessionId);
  },
};

