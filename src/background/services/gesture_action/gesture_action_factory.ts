import { Container } from 'inversify';
import { GestureActionType } from './gesture_action_type';
import { IGestureAction } from './gesture_action';
import { NewTabGestureAction } from './new_tab_gesture_action';
import { CloseTabGestureAction } from './close_tab_gesture_action';
import { CloseTabToLeftGestureAction } from './close_tab_to_left_gesture_action';
import { CloseTabToRightGestureAction } from './close_tab_to_right_gesture_action';
import { NextTabGestureAction } from './next_tab_gesture_action';
import { PrevTabGestureAction } from './prev_tab_gesture_action';
import { ReopenClosedTabGestureAction } from './reopen_closed_tab_gesture_action';
import { DuplicateTabGestureAction } from './duplicate_tab_gesture_action';
import { PinTabGestureAction } from './pin_tab_gesture_action';
import { MuteTabGestureAction } from './mute_tab_gesture_action';
import { NewWindowGestureAction } from './new_window_gesture_action';
import { NewIncognitoWindowGestureAction } from './new_incognito_window_gesture_action';
import { CloseWindowGestureAction } from './close_window_gesture_action';
import { MinimizeWindowGestureAction } from './minimize_window_gesture_action';
import { MaximizeWindowGestureAction } from './maximize_window_gesture_action';
import { ToggleFullscreenGestureAction } from './toggle_fullscreen_gesture_action';

export class GestureActionFactory {
    static create(type: GestureActionType, container: Container): IGestureAction {
        switch (type) {
            case GestureActionType.NEW_TAB:
                return container.get(NewTabGestureAction);
            case GestureActionType.CLOSE_TAB:
                return container.get(CloseTabGestureAction);
            case GestureActionType.CLOSE_TAB_TO_LEFT:
                return container.get(CloseTabToLeftGestureAction);
            case GestureActionType.CLOSE_TAB_TO_RIGHT:
                return container.get(CloseTabToRightGestureAction);
            case GestureActionType.NEXT_TAB:
                return container.get(NextTabGestureAction);
            case GestureActionType.PREV_TAB:
                return container.get(PrevTabGestureAction);
            case GestureActionType.REOPEN_CLOSED_TAB:
                return container.get(ReopenClosedTabGestureAction);
            case GestureActionType.DUPLICATE_TAB:
                return container.get(DuplicateTabGestureAction);
            case GestureActionType.PIN_TAB:
                return container.get(PinTabGestureAction);
            case GestureActionType.MUTE_TAB:
                return container.get(MuteTabGestureAction);
            case GestureActionType.NEW_WINDOW:
                return container.get(NewWindowGestureAction);
            case GestureActionType.NEW_INCOGNITO_WINDOW:
                return container.get(NewIncognitoWindowGestureAction);
            case GestureActionType.CLOSE_WINDOW:
                return container.get(CloseWindowGestureAction);
            case GestureActionType.MINIMIZE_WINDOW:
                return container.get(MinimizeWindowGestureAction);
            case GestureActionType.MAXIMIZE_WINDOW:
                return container.get(MaximizeWindowGestureAction);
            case GestureActionType.TOGGLE_FULLSCREEN:
                return container.get(ToggleFullscreenGestureAction);
            default:
                throw new Error(`未対応のGestureActionType: ${type}`);
        }
    }
} 