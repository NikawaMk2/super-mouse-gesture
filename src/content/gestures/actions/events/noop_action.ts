import { logger } from "@/shared/logger";
import { GestureActionEvent } from "./gesture_action";

/**
 * 何もしない空のアクション
 */
export const noopAction: GestureActionEvent = {
    execute(): void {
        logger.debug('actions', '何もしない');
        // 何もしない
    },
};
