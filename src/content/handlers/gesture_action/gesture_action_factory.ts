import 'reflect-metadata';
import { Gesture, GestureType } from "../../../common/api/setting/gesture_setting/gesture_type";
import ContainerProvider from "../../../common/utils/container_provider";
import BackToPreviousGestureAction from "./back_to_previous_swipe_action";
import CloseAndSelectLeftTabGestureAction from "./close_and_select_left_tab_swipe_action";
import CloseAndSelectRightTabGestureAction from "./close_and_select_right_tab_swipe_action";
import { GestureAction } from "./gesture_action";
import GoToNextGestureAction from "./go_to_next_swipe_action";
import NoAction from "./no_action";
import ScrollBottomGestureAction from "./scroll_bottom_swipe_action";
import ScrollDownGestureAction from "./scroll_down_swipe_action";
import ScrollTopGestureAction from "./scroll_top_swipe_action";
import ScrollUpGestureAction from "./scroll_up_swipe_action";
import SelectLeftTabGestureAction from "./select_left_tab_swipe_action";
import SelectRightTabGestureAction from "./select_right_tab_swipe_action";

export class GestureActionFactory {
    static createGestureAction(gestureType: GestureType): GestureAction {
        switch (gestureType) {
            case Gesture.BackToPrevious:
                return ContainerProvider.getContentScriptContainer().get(BackToPreviousGestureAction);
            case Gesture.SelectRightTab:
                return ContainerProvider.getContentScriptContainer().get(SelectRightTabGestureAction);
            case Gesture.SelectLeftTab:
                return ContainerProvider.getContentScriptContainer().get(SelectLeftTabGestureAction);
            case Gesture.CloseAndSelectRightTab:
                return ContainerProvider.getContentScriptContainer().get(CloseAndSelectRightTabGestureAction);
            case Gesture.CloseAndSelectLeftTab:
                return ContainerProvider.getContentScriptContainer().get(CloseAndSelectLeftTabGestureAction);
            case Gesture.ScrollUp:
                return ContainerProvider.getContentScriptContainer().get(ScrollUpGestureAction);
            case Gesture.ScrollDown:
                return ContainerProvider.getContentScriptContainer().get(ScrollDownGestureAction);
            case Gesture.GoToNext:
                return ContainerProvider.getContentScriptContainer().get(GoToNextGestureAction);
            case Gesture.ScrollTop:
                return ContainerProvider.getContentScriptContainer().get(ScrollTopGestureAction);
            case Gesture.ScrollBottom:
                return ContainerProvider.getContentScriptContainer().get(ScrollBottomGestureAction);
            case Gesture.None:
                return ContainerProvider.getContentScriptContainer().get(NoAction);
        }
    }
}
