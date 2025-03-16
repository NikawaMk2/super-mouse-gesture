import '../utils/reflect_metadata';
import { Container } from 'inversify';
import BackToPreviousGestureAction from '../../content/handlers/gesture_action/back_to_previous_swipe_action';
import CloseAndSelectLeftTabGestureAction from '../../content/handlers/gesture_action/close_and_select_left_tab_swipe_action';
import CloseAndSelectRightTabGestureAction from '../../content/handlers/gesture_action/close_and_select_right_tab_swipe_action';
import GoToNextGestureAction from '../../content/handlers/gesture_action/go_to_next_swipe_action';
import ScrollDownGestureAction from '../../content/handlers/gesture_action/scroll_down_swipe_action';
import ScrollUpGestureAction from '../../content/handlers/gesture_action/scroll_up_swipe_action';
import SelectLeftTabGestureAction from '../../content/handlers/gesture_action/select_left_tab_swipe_action';
import SelectRightTabGestureAction from '../../content/handlers/gesture_action/select_right_tab_swipe_action';
import ScrollBottomGestureAction from '../../content/handlers/gesture_action/scroll_bottom_swipe_action';
import ScrollTopGestureAction from '../../content/handlers/gesture_action/scroll_top_swipe_action';
import NoAction from '../../content/handlers/gesture_action/no_action';
import { BackgroundMessenger } from '../messaging/background_messenger';
import { MessageSender } from '../messaging/message_sender';
import { ChromeTabOperator } from '../../background/services/chrome_tab_operator';
import TYPES from './types';

export { default as TYPES } from './types';

export default class ContainerProvider {
    private static contentScriptContainer: Container | null = null;
    private static backgroundContainer: Container | null = null;

    static getContentScriptContainer(): Container {
        if (!this.contentScriptContainer) {
            this.contentScriptContainer = new Container({ defaultScope: "Singleton" });
            this.initializeContentScript(this.contentScriptContainer);
        }
        return this.contentScriptContainer;
    }

    static getBackgroundContainer(): Container {
        if (!this.backgroundContainer) {
            this.backgroundContainer = new Container({ defaultScope: "Singleton" });
            this.initializeBackground(this.backgroundContainer);
        }
        return this.backgroundContainer;
    }

    private static initializeContentScript(container: Container): void {
        try {
            // 基本サービスを最初にバインド
            container.bind(BackgroundMessenger).toSelf();
            container.bind<MessageSender>(TYPES.MessageSender).to(BackgroundMessenger);

            // アクションをバインド
            container.bind(CloseAndSelectLeftTabGestureAction).toSelf();
            container.bind(CloseAndSelectRightTabGestureAction).toSelf();
            container.bind(SelectLeftTabGestureAction).toSelf();
            container.bind(SelectRightTabGestureAction).toSelf();
            container.bind(BackToPreviousGestureAction).toSelf();
            container.bind(ScrollUpGestureAction).toSelf();
            container.bind(ScrollDownGestureAction).toSelf();
            container.bind(GoToNextGestureAction).toSelf();
            container.bind(ScrollTopGestureAction).toSelf();
            container.bind(ScrollBottomGestureAction).toSelf();
            container.bind(NoAction).toSelf();

            console.log('Content script container initialized with bindings');
        } catch (error) {
            console.error('Error initializing container:', error);
        }
    }

    private static initializeBackground(container: Container): void {
        container.bind<ChromeTabOperator>(TYPES.ChromeTabOperator).to(ChromeTabOperator);
    }
}
