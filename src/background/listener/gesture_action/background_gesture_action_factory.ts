import 'reflect-metadata';
import { BackgroundGestureAction } from './background_gesture_action';
import { BackgroundMessage, BackgroundMessageType } from '../../../common/messaging/types/background_message_type';
import BackgroundSelectLeftTabGestureAction from './background_select_left_tab_swipe_action';
import BackgroundCloseAndSelectLeftTabGestureAction from './background_close_and_select_left_tab_swipe_action';
import BackgroundCloseAndSelectRightTabGestureAction from './background_close_and_select_right_tab_swipe_action';
import ContainerProvider from '../../../common/utils/container_provider';
import BackgroundSelectRightTabGestureAction from './background_select_right_tab_swipe_action';

export class BackgroundGestureActionFactory {
    static createGestureAction(gestureType: BackgroundMessageType): BackgroundGestureAction {
        switch (gestureType) {
            case BackgroundMessage.SelectRightTab:
                return ContainerProvider.getBackgroundContainer().get(BackgroundSelectRightTabGestureAction);
            case BackgroundMessage.SelectLeftTab:
                return ContainerProvider.getBackgroundContainer().get(BackgroundSelectLeftTabGestureAction);
            case BackgroundMessage.CloseAndSelectRightTab:
                return ContainerProvider.getBackgroundContainer().get(BackgroundCloseAndSelectRightTabGestureAction);
            case BackgroundMessage.CloseAndSelectLeftTab:
                return ContainerProvider.getBackgroundContainer().get(BackgroundCloseAndSelectLeftTabGestureAction);
        }
    }
}
