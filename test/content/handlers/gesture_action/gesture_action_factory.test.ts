import 'reflect-metadata';
import { Container } from 'inversify';
import { Gesture } from '../../../../src/common/api/setting/gesture_setting/gesture_type';
import { MessageSender } from '../../../../src/common/messaging/message_sender';
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

// モック化されたTYPESをインポート
import { TYPES } from '../../../../src/common/utils/container_provider';

const mockContainer = new Container();
const mockMessenger: MessageSender = {
    sendMessage: jest.fn()
};

// MessageSenderをバインド
mockContainer.bind<MessageSender>(TYPES.MessageSender).toConstantValue(mockMessenger);

// 各アクションクラスをバインド
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

// ContainerProviderのモックを設定
jest.mock('../../../../src/common/utils/container_provider', () => {
    const mockGetContentScriptContainer = jest.fn(() => mockContainer);
    const mockGetBackgroundContainer = jest.fn(() => mockContainer);

    return {
        __esModule: true,
        TYPES: {
            MessageSender: Symbol.for('MessageSender')
        },
        default: {
            getContentScriptContainer: mockGetContentScriptContainer,
            getBackgroundContainer: mockGetBackgroundContainer
        }
    };
});

describe('GestureActionFactoryクラスのテスト', () => {
    beforeEach(() => {
        // 各テストの前にモックをリセット
        jest.clearAllMocks();
    });

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