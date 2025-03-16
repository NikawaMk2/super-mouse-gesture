import 'reflect-metadata';
import { BackgroundGestureAction } from './background_gesture_action';
import BackgroundMessage, { BackgroundMessageType } from '../../../common/messaging/types/background_message_type';
import BackgroundSelectLeftTabGestureAction from './background_select_left_tab_swipe_action';
import BackgroundCloseAndSelectLeftTabGestureAction from './background_close_and_select_left_tab_swipe_action';
import BackgroundCloseAndSelectRightTabGestureAction from './background_close_and_select_right_tab_swipe_action';
import ContainerProvider from '../../../common/utils/container_provider';
import BackgroundSelectRightTabGestureAction from './background_select_right_tab_swipe_action';
import Logger from '../../../common/utils/logger';

export class BackgroundGestureActionFactory {
    static createGestureAction(gestureType: BackgroundMessageType): BackgroundGestureAction {
        const container = ContainerProvider.getBackgroundContainer();
        
        switch (gestureType) {
            case BackgroundMessage.SelectRightTab:
                return container.get(BackgroundSelectRightTabGestureAction);
            case BackgroundMessage.SelectLeftTab:
                return container.get(BackgroundSelectLeftTabGestureAction);
            case BackgroundMessage.CloseAndSelectRightTab:
                return container.get(BackgroundCloseAndSelectRightTabGestureAction);
            case BackgroundMessage.CloseAndSelectLeftTab:
                return container.get(BackgroundCloseAndSelectLeftTabGestureAction);
            default:
                Logger.error(`未知のジェスチャータイプ: ${gestureType}`);
                throw new Error(`未知のジェスチャータイプ: ${gestureType}`);
        }
    }
}
