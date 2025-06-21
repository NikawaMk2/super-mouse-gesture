import { GestureActionType } from "../gesture_action_type";
import { GestureActionName } from "./gesture_action_name";
import { NextTabGestureActionName } from "./next_tab_gesture_action_name";
import { PrevTabGestureActionName } from "./prev_tab_gesture_action_name";
import { ReopenClosedTabGestureActionName } from "./reopen_closed_tab_gesture_action_name";
import { DuplicateTabGestureActionName } from "./duplicate_tab_gesture_action_name";
import { PinTabGestureActionName } from "./pin_tab_gesture_action_name";
import { MuteTabGestureActionName } from "./mute_tab_gesture_action_name";
import { NewWindowGestureActionName } from "./new_window_gesture_action_name";
import { NewIncognitoWindowGestureActionName } from "./new_incognito_window_gesture_action_name";
import { CloseWindowGestureActionName } from "./close_window_gesture_action_name";
import { MinimizeWindowGestureActionName } from "./minimize_window_gesture_action_name";
import { MaximizeWindowGestureActionName } from "./maximize_window_gesture_action_name";
import { ToggleFullscreenGestureActionName } from "./toggle_fullscreen_gesture_action_name";
import { NoneGestureActionName } from "./none_gesture_action_name";
import { GoBackGestureActionName } from "./go_back_gesture_action_name";
import { ForwardGestureActionName } from "./forward_gesture_action_name";
import { ReloadPageGestureActionName } from "./reload_page_gesture_action_name";
import { StopLoadingGestureActionName } from "./stop_loading_gesture_action_name";
import { ScrollToTopGestureActionName } from "./scroll_to_top_gesture_action_name";
import { ScrollToBottomGestureActionName } from "./scroll_to_bottom_gesture_action_name";
import { ZoomInGestureActionName } from "./zoom_in_gesture_action_name";
import { ZoomOutGestureActionName } from "./zoom_out_gesture_action_name";
import { ShowFindBarGestureActionName } from "./show_find_bar_gesture_action_name";
import { NewTabGestureActionName } from "./new_tab_gesture_action_name";
import { CloseTabGestureActionName } from "./close_tab_gesture_action_name";
import { CloseTabToLeftGestureActionName } from "./close_tab_to_left_gesture_action_name";
import { CloseTabToRightGestureActionName } from "./close_tab_to_right_gesture_action_name";

export class GestureActionNameMap {
    private static readonly map: Map<GestureActionType, GestureActionName> = new Map([
        [GestureActionType.GO_BACK, new GoBackGestureActionName()],
        [GestureActionType.FORWARD, new ForwardGestureActionName()],
        [GestureActionType.RELOAD_PAGE, new ReloadPageGestureActionName()],
        [GestureActionType.STOP_LOADING, new StopLoadingGestureActionName()],
        [GestureActionType.SCROLL_TO_TOP, new ScrollToTopGestureActionName()],
        [GestureActionType.SCROLL_TO_BOTTOM, new ScrollToBottomGestureActionName()],
        [GestureActionType.ZOOM_IN, new ZoomInGestureActionName()],
        [GestureActionType.ZOOM_OUT, new ZoomOutGestureActionName()],
        [GestureActionType.SHOW_FIND_BAR, new ShowFindBarGestureActionName()],
        [GestureActionType.NEW_TAB, new NewTabGestureActionName()],
        [GestureActionType.CLOSE_TAB, new CloseTabGestureActionName()],
        [GestureActionType.CLOSE_TAB_TO_LEFT, new CloseTabToLeftGestureActionName()],
        [GestureActionType.CLOSE_TAB_TO_RIGHT, new CloseTabToRightGestureActionName()],
        [GestureActionType.NEXT_TAB, new NextTabGestureActionName()],
        [GestureActionType.PREV_TAB, new PrevTabGestureActionName()],
        [GestureActionType.REOPEN_CLOSED_TAB, new ReopenClosedTabGestureActionName()],
        [GestureActionType.DUPLICATE_TAB, new DuplicateTabGestureActionName()],
        [GestureActionType.PIN_TAB, new PinTabGestureActionName()],
        [GestureActionType.MUTE_TAB, new MuteTabGestureActionName()],
        [GestureActionType.NEW_WINDOW, new NewWindowGestureActionName()],
        [GestureActionType.NEW_INCOGNITO_WINDOW, new NewIncognitoWindowGestureActionName()],
        [GestureActionType.CLOSE_WINDOW, new CloseWindowGestureActionName()],
        [GestureActionType.MINIMIZE_WINDOW, new MinimizeWindowGestureActionName()],
        [GestureActionType.MAXIMIZE_WINDOW, new MaximizeWindowGestureActionName()],
        [GestureActionType.TOGGLE_FULLSCREEN, new ToggleFullscreenGestureActionName()],
        [GestureActionType.NONE, new NoneGestureActionName()],
    ]);

    public static get(actionType: GestureActionType): string {
        // 事前条件の検証
        if (!actionType || typeof actionType !== 'string') {
            throw new Error('actionTypeは有効な文字列である必要があります');
        }

        const actionName = this.map.get(actionType);
        if (!actionName) {
            throw new Error(`未対応のGestureActionType: ${actionType}`);
        }

        return actionName.getJapaneseName();
    }
}
