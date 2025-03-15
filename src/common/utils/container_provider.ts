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

export const TYPES = {
    MessageSender: Symbol.for('MessageSender')
};

export default class ContainerProvider {
    private static _container: Container | null = null;

    static get container(): Container {
        if (!this._container) {
            this._container = new Container();
            this.initialize();
        }
        return this._container;
    }

    static initialize(): void {
        this.container.bind(BackToPreviousGestureAction).toSelf().inSingletonScope();
        this.container.bind(SelectRightTabGestureAction).toSelf().inSingletonScope();
        this.container.bind(SelectLeftTabGestureAction).toSelf().inSingletonScope();
        this.container.bind(CloseAndSelectRightTabGestureAction).toSelf().inSingletonScope();
        this.container.bind(CloseAndSelectLeftTabGestureAction).toSelf().inSingletonScope();
        this.container.bind(ScrollUpGestureAction).toSelf().inSingletonScope();
        this.container.bind(ScrollDownGestureAction).toSelf().inSingletonScope();
        this.container.bind(GoToNextGestureAction).toSelf().inSingletonScope();
        this.container.bind(ScrollTopGestureAction).toSelf().inSingletonScope();
        this.container.bind(ScrollBottomGestureAction).toSelf().inSingletonScope();
        this.container.bind(NoAction).toSelf().inSingletonScope();

        this.container.bind(BackgroundMessenger).toSelf().inSingletonScope();

        this.container.bind<MessageSender>(TYPES.MessageSender).to(BackgroundMessenger).inSingletonScope();
    }
}
