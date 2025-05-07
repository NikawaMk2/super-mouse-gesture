import { BackgroundContainerProvider } from '../../../../../src/background/provider/background_container_provider';
import { GestureActionFactory } from '../../../../../src/background/services/gesture_action/gesture_action_factory';
import { GestureActionType } from '../../../../../src/background/services/gesture_action/gesture_action_type';
import { NewTabGestureAction } from '../../../../../src/background/services/gesture_action/new_tab_gesture_action';
import { CloseTabGestureAction } from '../../../../../src/background/services/gesture_action/close_tab_gesture_action';
import { CloseTabToLeftGestureAction } from '../../../../../src/background/services/gesture_action/close_tab_to_left_gesture_action';
import { CloseTabToRightGestureAction } from '../../../../../src/background/services/gesture_action/close_tab_to_right_gesture_action';
import { NextTabGestureAction } from '../../../../../src/background/services/gesture_action/next_tab_gesture_action';
import { PrevTabGestureAction } from '../../../../../src/background/services/gesture_action/prev_tab_gesture_action';
import { ReopenClosedTabGestureAction } from '../../../../../src/background/services/gesture_action/reopen_closed_tab_gesture_action';
import { DuplicateTabGestureAction } from '../../../../../src/background/services/gesture_action/duplicate_tab_gesture_action';
import { PinTabGestureAction } from '../../../../../src/background/services/gesture_action/pin_tab_gesture_action';
import { MuteTabGestureAction } from '../../../../../src/background/services/gesture_action/mute_tab_gesture_action';
import { NewWindowGestureAction } from '../../../../../src/background/services/gesture_action/new_window_gesture_action';
import { NewIncognitoWindowGestureAction } from '../../../../../src/background/services/gesture_action/new_incognito_window_gesture_action';
import { CloseWindowGestureAction } from '../../../../../src/background/services/gesture_action/close_window_gesture_action';
import { MinimizeWindowGestureAction } from '../../../../../src/background/services/gesture_action/minimize_window_gesture_action';
import { MaximizeWindowGestureAction } from '../../../../../src/background/services/gesture_action/maximize_window_gesture_action';
import { ToggleFullscreenGestureAction } from '../../../../../src/background/services/gesture_action/toggle_fullscreen_gesture_action';

describe('GestureActionFactory', () => {
    let container: ReturnType<BackgroundContainerProvider['getContainer']>;

    beforeEach(() => {
        // 本物のDIコンテナを取得
        container = new BackgroundContainerProvider().getContainer();
    });

    it('全てのGestureActionTypeで正しいクラスのインスタンスが返ること', () => {
        expect(GestureActionFactory.create(GestureActionType.NEW_TAB, container)).toBeInstanceOf(NewTabGestureAction);
        expect(GestureActionFactory.create(GestureActionType.CLOSE_TAB, container)).toBeInstanceOf(CloseTabGestureAction);
        expect(GestureActionFactory.create(GestureActionType.CLOSE_TAB_TO_LEFT, container)).toBeInstanceOf(CloseTabToLeftGestureAction);
        expect(GestureActionFactory.create(GestureActionType.CLOSE_TAB_TO_RIGHT, container)).toBeInstanceOf(CloseTabToRightGestureAction);
        expect(GestureActionFactory.create(GestureActionType.NEXT_TAB, container)).toBeInstanceOf(NextTabGestureAction);
        expect(GestureActionFactory.create(GestureActionType.PREV_TAB, container)).toBeInstanceOf(PrevTabGestureAction);
        expect(GestureActionFactory.create(GestureActionType.REOPEN_CLOSED_TAB, container)).toBeInstanceOf(ReopenClosedTabGestureAction);
        expect(GestureActionFactory.create(GestureActionType.DUPLICATE_TAB, container)).toBeInstanceOf(DuplicateTabGestureAction);
        expect(GestureActionFactory.create(GestureActionType.PIN_TAB, container)).toBeInstanceOf(PinTabGestureAction);
        expect(GestureActionFactory.create(GestureActionType.MUTE_TAB, container)).toBeInstanceOf(MuteTabGestureAction);
        expect(GestureActionFactory.create(GestureActionType.NEW_WINDOW, container)).toBeInstanceOf(NewWindowGestureAction);
        expect(GestureActionFactory.create(GestureActionType.NEW_INCOGNITO_WINDOW, container)).toBeInstanceOf(NewIncognitoWindowGestureAction);
        expect(GestureActionFactory.create(GestureActionType.CLOSE_WINDOW, container)).toBeInstanceOf(CloseWindowGestureAction);
        expect(GestureActionFactory.create(GestureActionType.MINIMIZE_WINDOW, container)).toBeInstanceOf(MinimizeWindowGestureAction);
        expect(GestureActionFactory.create(GestureActionType.MAXIMIZE_WINDOW, container)).toBeInstanceOf(MaximizeWindowGestureAction);
        expect(GestureActionFactory.create(GestureActionType.TOGGLE_FULLSCREEN, container)).toBeInstanceOf(ToggleFullscreenGestureAction);
    });
}); 