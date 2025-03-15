import 'reflect-metadata';
import { Container } from 'inversify';
import { Gesture } from '../../../../src/common/api/setting/gesture_setting/gesture_type';
import { MessageSender } from '../../../../src/common/messaging/message_sender';

const mockContainer = new Container();
const mockMessenger: MessageSender = {
    sendMessage: jest.fn()
};

const MOCK_TYPES = {
    MessageSender: Symbol.for('MessageSender')
};

jest.mock('../../../../src/common/utils/container_provider', () => ({
    __esModule: true,
    TYPES: MOCK_TYPES,
    default: {
        container: mockContainer
    }
}));

import { TYPES } from '../../../../src/common/utils/container_provider';
import { GestureActionFactory } from '../../../../src/content/handlers/gesture_action/gesture_action_factory';
import BackToPreviousGestureAction from '../../../../src/content/handlers/gesture_action/back_to_previous_swipe_action';
import NoAction from '../../../../src/content/handlers/gesture_action/no_action';
import SelectRightTabGestureAction from '../../../../src/content/handlers/gesture_action/select_right_tab_swipe_action';
import SelectLeftTabGestureAction from '../../../../src/content/handlers/gesture_action/select_left_tab_swipe_action';
import CloseAndSelectRightTabGestureAction from '../../../../src/content/handlers/gesture_action/close_and_select_right_tab_swipe_action';
import CloseAndSelectLeftTabGestureAction from '../../../../src/content/handlers/gesture_action/close_and_select_left_tab_swipe_action';
import ScrollUpGestureAction from '../../../../src/content/handlers/gesture_action/scroll_up_swipe_action';
import ScrollDownGestureAction from '../../../../src/content/handlers/gesture_action/scroll_down_swipe_action';
import GoToNextGestureAction from '../../../../src/content/handlers/gesture_action/go_to_next_swipe_action';
import ScrollTopGestureAction from '../../../../src/content/handlers/gesture_action/scroll_top_swipe_action';
import ScrollBottomGestureAction from '../../../../src/content/handlers/gesture_action/scroll_bottom_swipe_action';

mockContainer.bind<MessageSender>(TYPES.MessageSender).toConstantValue(mockMessenger);

const actionClasses = [
    BackToPreviousGestureAction,
    SelectRightTabGestureAction,
    SelectLeftTabGestureAction,
    CloseAndSelectRightTabGestureAction,
    CloseAndSelectLeftTabGestureAction,
    ScrollUpGestureAction,
    ScrollDownGestureAction,
    GoToNextGestureAction,
    ScrollTopGestureAction,
    ScrollBottomGestureAction,
    NoAction
];

actionClasses.forEach(actionClass => {
    mockContainer.bind(actionClass).toSelf();
});

describe('GestureActionFactoryクラスのテスト', () => {
    it.each([
        [Gesture.BackToPrevious, BackToPreviousGestureAction],
        [Gesture.SelectRightTab, SelectRightTabGestureAction],
        [Gesture.SelectLeftTab, SelectLeftTabGestureAction],
        [Gesture.CloseAndSelectRightTab, CloseAndSelectRightTabGestureAction],
        [Gesture.CloseAndSelectLeftTab, CloseAndSelectLeftTabGestureAction],
        [Gesture.ScrollUp, ScrollUpGestureAction],
        [Gesture.ScrollDown, ScrollDownGestureAction],
        [Gesture.GoToNext, GoToNextGestureAction],
        [Gesture.ScrollTop, ScrollTopGestureAction],
        [Gesture.ScrollBottom, ScrollBottomGestureAction],
        [Gesture.None, NoAction]
    ])('%sジェスチャーに対して正しいアクションを返すこと', (gesture, expectedClass) => {
        const action = GestureActionFactory.createGestureAction(gesture);
        expect(action).toBeInstanceOf(expectedClass);
    });
});