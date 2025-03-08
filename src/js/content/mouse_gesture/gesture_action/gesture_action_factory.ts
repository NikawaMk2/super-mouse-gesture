import { GestureType } from "../../../common/setting/gesture_setting/gesture_type";
import ContainerProvider from "../../../common/util/container_provider";
import BackToPreviousGestureAction from "./back_to_previous_swipe_action";
import CloseAndSelectLeftTabGestureAction from "./close_and_select_left_tab_swipe_action";
import CloseAndSelectRightTabGestureAction from "./close_and_select_right_tab_swipe_action";
import GoToNextGestureAction from "./go_to_next_swipe_action";
import ScrollBottomGestureAction from "./scroll_bottom_swipe_action";
import ScrollDownGestureAction from "./scroll_down_swipe_action";
import ScrollTopGestureAction from "./scroll_top_swipe_action";
import ScrollUpGestureAction from "./scroll_up_swipe_action";
import SelectLeftTabGestureAction from "./select_left_tab_swipe_action";
import SelectRightTabGestureAction from "./select_right_tab_swipe_action";

export class GestureActionFactory {
    static createGestureAction(gestureType: GestureType): GestureAction {
        switch (gestureType) {
            case GestureType.BackToPrevious:
                return ContainerProvider.container.get(BackToPreviousGestureAction);
            case GestureType.SelectRightTab:
                return ContainerProvider.container.get(SelectRightTabGestureAction);
            case GestureType.SelectLeftTab:
                return ContainerProvider.container.get(SelectLeftTabGestureAction);
            case GestureType.CloseAndSelectRightTab:
                return ContainerProvider.container.get(CloseAndSelectRightTabGestureAction);
            case GestureType.CloseAndSelectLeftTab:
                return ContainerProvider.container.get(CloseAndSelectLeftTabGestureAction);
            case GestureType.ScrollUp:
                return ContainerProvider.container.get(ScrollUpGestureAction);
            case GestureType.ScrollDown:
                return ContainerProvider.container.get(ScrollDownGestureAction);
            case GestureType.GoToNext:
                return ContainerProvider.container.get(GoToNextGestureAction);
            case GestureType.ScrollTop:
                return ContainerProvider.container.get(ScrollTopGestureAction);
            case GestureType.ScrollBottom:
                return ContainerProvider.container.get(ScrollBottomGestureAction);
            case GestureType.None:
                throw new Error(`${gestureType}が指定されました`);
        }
    }
}
