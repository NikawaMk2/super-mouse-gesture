import 'reflect-metadata';
import { Container } from 'inversify';
import "reflect-metadata";
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

export const TYPES = {
    MessageSender: Symbol.for('MessageSender'),
    ChromeTabOperator: Symbol.for('ChromeTabOperator')
} as const;

export default class ContainerProvider {
    private static contentScriptContainer: Container | null = null;
    private static backgroundContainer: Container | null = null;

    static getContentScriptContainer(): Container {
        if (!this.contentScriptContainer) {
            this.contentScriptContainer = new Container();
            this.initializeContentScript(this.contentScriptContainer);
        }
        return this.contentScriptContainer;
    }

    static getBackgroundContainer(): Container {
        if (!this.backgroundContainer) {
            this.backgroundContainer = new Container();
            this.initializeBackground(this.backgroundContainer);
        }
        return this.backgroundContainer;
    }

    private static initializeContentScript(container: Container): void {
        container.bind(BackToPreviousGestureAction).toSelf().inSingletonScope();
        container.bind(SelectRightTabGestureAction).toSelf().inSingletonScope();
        container.bind(SelectLeftTabGestureAction).toSelf().inSingletonScope();
        container.bind(CloseAndSelectRightTabGestureAction).toSelf().inSingletonScope();
        container.bind(CloseAndSelectLeftTabGestureAction).toSelf().inSingletonScope();
        container.bind(ScrollUpGestureAction).toSelf().inSingletonScope();
        container.bind(ScrollDownGestureAction).toSelf().inSingletonScope();
        container.bind(GoToNextGestureAction).toSelf().inSingletonScope();
        container.bind(ScrollTopGestureAction).toSelf().inSingletonScope();
        container.bind(ScrollBottomGestureAction).toSelf().inSingletonScope();
        container.bind(NoAction).toSelf().inSingletonScope();
        container.bind(BackgroundMessenger).toSelf().inSingletonScope();
        container.bind<MessageSender>(TYPES.MessageSender).to(BackgroundMessenger).inSingletonScope();
    }

    private static initializeBackground(container: Container): void {
        container.bind<ChromeTabOperator>(TYPES.ChromeTabOperator).to(ChromeTabOperator).inSingletonScope();
    }
}
