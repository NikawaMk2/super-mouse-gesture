import { GestureActionType } from "@/shared/types/gesture-action";
import { scrollUpAction } from "./events/scroll_up_action";
import { scrollDownAction } from "./events/scroll_down_action";
import { backAction } from "./events/back_action";
import { forwardAction } from "./events/forward_action";
import { previousTabAction } from "./events/previous_tab_action";
import { nextTabAction } from "./events/next_tab_action";
import { closeTabAndGoLeftAction } from "./events/close_tab_and_go_left_action";
import { closeTabAndGoRightAction } from "./events/close_tab_and_go_right_action";
import { zoomInAction } from "./events/zoom_in_action";
import { zoomOutAction } from "./events/zoom_out_action";
import { newTabAction } from "./events/new_tab_action";
import { toggleFullscreenAction } from "./events/toggle_fullscreen_action";
import { scrollToTopAction } from "./events/scroll_to_top_action";
import { scrollToBottomAction } from "./events/scroll_to_bottom_action";
import { reloadAction } from "./events/reload_action";
import { restoreTabAction } from "./events/restore_tab_action";
import { GestureActionEvent } from "./events/gesture_action";
import { DirectionTrail } from "../models/direction_trail";
import { settings } from "@/shared/utils/settings";
import { noopAction } from "./events/noop_action";

/**
 * ジェスチャアクションを作成する
 * @param trail 方向履歴
 * @returns ジェスチャアクション
 */
export function createGestureAction(trail: DirectionTrail): GestureActionEvent {
    const gesturePath = trail.toPath();
    const actionType = settings.getActionForGesture(gesturePath);

    switch (actionType) {
        case GestureActionType.SCROLL_UP:
            return scrollUpAction;
        case GestureActionType.SCROLL_DOWN:
            return scrollDownAction;
        case GestureActionType.GO_BACK:
            return backAction;
        case GestureActionType.GO_FORWARD:
            return forwardAction;
        case GestureActionType.PREVIOUS_TAB:
            return previousTabAction;
        case GestureActionType.NEXT_TAB:
            return nextTabAction;
        case GestureActionType.CLOSE_TAB_AND_GO_LEFT:
            return closeTabAndGoLeftAction;
        case GestureActionType.CLOSE_TAB_AND_GO_RIGHT:
            return closeTabAndGoRightAction;
        case GestureActionType.ZOOM_IN:
            return zoomInAction;
        case GestureActionType.ZOOM_OUT:
            return zoomOutAction;
        case GestureActionType.NEW_TAB:
            return newTabAction;
        case GestureActionType.TOGGLE_FULLSCREEN:
            return toggleFullscreenAction;
        case GestureActionType.SCROLL_TO_TOP:
            return scrollToTopAction;
        case GestureActionType.SCROLL_TO_BOTTOM:
            return scrollToBottomAction;
        case GestureActionType.RELOAD:
            return reloadAction;
        case GestureActionType.RESTORE_TAB:
            return restoreTabAction;
        default:
            return noopAction;
    }
}
