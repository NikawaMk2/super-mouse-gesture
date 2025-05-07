import { Container } from 'inversify';
import { GestureActionFactory } from '../../../../src/background/services/gesture_action/gesture_action_factory';
import { GestureActionType } from '../../../../src/background/services/gesture_action/gesture_action_type';
import { NewTabGestureAction } from '../../../../src/background/services/gesture_action/new_tab_gesture_action';
import { CloseTabGestureAction } from '../../../../src/background/services/gesture_action/close_tab_gesture_action';
import { CloseTabToLeftGestureAction } from '../../../../src/background/services/gesture_action/close_tab_to_left_gesture_action';
import { CloseTabToRightGestureAction } from '../../../../src/background/services/gesture_action/close_tab_to_right_gesture_action';
import { NextTabGestureAction } from '../../../../src/background/services/gesture_action/next_tab_gesture_action';
import { PrevTabGestureAction } from '../../../../src/background/services/gesture_action/prev_tab_gesture_action';
import { ReopenClosedTabGestureAction } from '../../../../src/background/services/gesture_action/reopen_closed_tab_gesture_action';
import { DuplicateTabGestureAction } from '../../../../src/background/services/gesture_action/duplicate_tab_gesture_action';
import { PinTabGestureAction } from '../../../../src/background/services/gesture_action/pin_tab_gesture_action';
import { MuteTabGestureAction } from '../../../../src/background/services/gesture_action/mute_tab_gesture_action';
import { NewWindowGestureAction } from '../../../../src/background/services/gesture_action/new_window_gesture_action';
import { NewIncognitoWindowGestureAction } from '../../../../src/background/services/gesture_action/new_incognito_window_gesture_action';
import { CloseWindowGestureAction } from '../../../../src/background/services/gesture_action/close_window_gesture_action';
import { MinimizeWindowGestureAction } from '../../../../src/background/services/gesture_action/minimize_window_gesture_action';
import { MaximizeWindowGestureAction } from '../../../../src/background/services/gesture_action/maximize_window_gesture_action';
import { ToggleFullscreenGestureAction } from '../../../../src/background/services/gesture_action/toggle_fullscreen_gesture_action';

describe('GestureActionFactory', () => {
    let container: Container;

    beforeEach(() => {
        container = new Container();
        container.bind(NewTabGestureAction).toConstantValue({} as any);
        container.bind(CloseTabGestureAction).toConstantValue({} as any);
        container.bind(CloseTabToLeftGestureAction).toConstantValue({} as any);
        container.bind(CloseTabToRightGestureAction).toConstantValue({} as any);
        container.bind(NextTabGestureAction).toConstantValue({} as any);
        container.bind(PrevTabGestureAction).toConstantValue({} as any);
        container.bind(ReopenClosedTabGestureAction).toConstantValue({} as any);
        container.bind(DuplicateTabGestureAction).toConstantValue({} as any);
        container.bind(PinTabGestureAction).toConstantValue({} as any);
        container.bind(MuteTabGestureAction).toConstantValue({} as any);
        container.bind(NewWindowGestureAction).toConstantValue({} as any);
        container.bind(NewIncognitoWindowGestureAction).toConstantValue({} as any);
        container.bind(CloseWindowGestureAction).toConstantValue({} as any);
        container.bind(MinimizeWindowGestureAction).toConstantValue({} as any);
        container.bind(MaximizeWindowGestureAction).toConstantValue({} as any);
        container.bind(ToggleFullscreenGestureAction).toConstantValue({} as any);
    });

    it('全てのGestureActionTypeで正しいクラスが返ること', () => {
        expect(GestureActionFactory.create(GestureActionType.NEW_TAB, container)).toBe(container.get(NewTabGestureAction));
        expect(GestureActionFactory.create(GestureActionType.CLOSE_TAB, container)).toBe(container.get(CloseTabGestureAction));
        expect(GestureActionFactory.create(GestureActionType.CLOSE_TAB_TO_LEFT, container)).toBe(container.get(CloseTabToLeftGestureAction));
        expect(GestureActionFactory.create(GestureActionType.CLOSE_TAB_TO_RIGHT, container)).toBe(container.get(CloseTabToRightGestureAction));
        expect(GestureActionFactory.create(GestureActionType.NEXT_TAB, container)).toBe(container.get(NextTabGestureAction));
        expect(GestureActionFactory.create(GestureActionType.PREV_TAB, container)).toBe(container.get(PrevTabGestureAction));
        expect(GestureActionFactory.create(GestureActionType.REOPEN_CLOSED_TAB, container)).toBe(container.get(ReopenClosedTabGestureAction));
        expect(GestureActionFactory.create(GestureActionType.DUPLICATE_TAB, container)).toBe(container.get(DuplicateTabGestureAction));
        expect(GestureActionFactory.create(GestureActionType.PIN_TAB, container)).toBe(container.get(PinTabGestureAction));
        expect(GestureActionFactory.create(GestureActionType.MUTE_TAB, container)).toBe(container.get(MuteTabGestureAction));
        expect(GestureActionFactory.create(GestureActionType.NEW_WINDOW, container)).toBe(container.get(NewWindowGestureAction));
        expect(GestureActionFactory.create(GestureActionType.NEW_INCOGNITO_WINDOW, container)).toBe(container.get(NewIncognitoWindowGestureAction));
        expect(GestureActionFactory.create(GestureActionType.CLOSE_WINDOW, container)).toBe(container.get(CloseWindowGestureAction));
        expect(GestureActionFactory.create(GestureActionType.MINIMIZE_WINDOW, container)).toBe(container.get(MinimizeWindowGestureAction));
        expect(GestureActionFactory.create(GestureActionType.MAXIMIZE_WINDOW, container)).toBe(container.get(MaximizeWindowGestureAction));
        expect(GestureActionFactory.create(GestureActionType.TOGGLE_FULLSCREEN, container)).toBe(container.get(ToggleFullscreenGestureAction));
    });

    it('未対応のGestureActionTypeで例外が投げられること', () => {
        expect(() => GestureActionFactory.create('unknown_type' as any, container)).toThrowError('未対応のGestureActionType: unknown_type');
    });
}); 