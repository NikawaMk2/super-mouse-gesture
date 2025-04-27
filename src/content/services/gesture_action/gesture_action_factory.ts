import { ContainerProvider } from '../../../common/provider/container_provider';
import { GestureActionType } from './gesture_action_type';

export class GestureActionFactory {
  static create(type: GestureActionType) {
    const container = ContainerProvider.getContainer();
    switch (type) {
      case GestureActionType.GO_BACK:
        return container.get(require('./go_back_gesture_action').GoBackGestureAction);
      case GestureActionType.FORWARD:
        return container.get(require('./forward_gesture_action').ForwardGestureAction);
      case GestureActionType.RELOAD_PAGE:
        return container.get(require('./reload_page_gesture_action').ReloadPageGestureAction);
      case GestureActionType.STOP_LOADING:
        return container.get(require('./stop_loading_gesture_action').StopLoadingGestureAction);
      case GestureActionType.SCROLL_TO_TOP:
        return container.get(require('./scroll_to_top_gesture_action').ScrollToTopGestureAction);
      case GestureActionType.SCROLL_TO_BOTTOM:
        return container.get(require('./scroll_to_bottom_gesture_action').ScrollToBottomGestureAction);
      case GestureActionType.ZOOM_IN:
        return container.get(require('./zoom_in_gesture_action').ZoomInGestureAction);
      case GestureActionType.ZOOM_OUT:
        return container.get(require('./zoom_out_gesture_action').ZoomOutGestureAction);
      case GestureActionType.SHOW_FIND_BAR:
        return container.get(require('./show_find_bar_gesture_action').ShowFindBarGestureAction);
      case GestureActionType.NEW_TAB:
        return container.get(require('./new_tab_gesture_action').NewTabGestureAction);
      case GestureActionType.CLOSE_TAB:
        return container.get(require('./close_tab_gesture_action').CloseTabGestureAction);
      case GestureActionType.CLOSE_TAB_TO_LEFT:
        return container.get(require('./close_tab_to_left_gesture_action').CloseTabToLeftGestureAction);
      case GestureActionType.CLOSE_TAB_TO_RIGHT:
        return container.get(require('./close_tab_to_right_gesture_action').CloseTabToRightGestureAction);
      case GestureActionType.NEXT_TAB:
        return container.get(require('./next_tab_gesture_action').NextTabGestureAction);
      case GestureActionType.PREV_TAB:
        return container.get(require('./prev_tab_gesture_action').PrevTabGestureAction);
      case GestureActionType.REOPEN_CLOSED_TAB:
        return container.get(require('./reopen_closed_tab_gesture_action').ReopenClosedTabGestureAction);
      case GestureActionType.DUPLICATE_TAB:
        return container.get(require('./duplicate_tab_gesture_action').DuplicateTabGestureAction);
      case GestureActionType.PIN_TAB:
        return container.get(require('./pin_tab_gesture_action').PinTabGestureAction);
      case GestureActionType.MUTE_TAB:
        return container.get(require('./mute_tab_gesture_action').MuteTabGestureAction);
      case GestureActionType.NEW_WINDOW:
        return container.get(require('./new_window_gesture_action').NewWindowGestureAction);
      case GestureActionType.NEW_INCOGNITO_WINDOW:
        return container.get(require('./new_incognito_window_gesture_action').NewIncognitoWindowGestureAction);
      case GestureActionType.CLOSE_WINDOW:
        return container.get(require('./close_window_gesture_action').CloseWindowGestureAction);
      case GestureActionType.MINIMIZE_WINDOW:
        return container.get(require('./minimize_window_gesture_action').MinimizeWindowGestureAction);
      case GestureActionType.MAXIMIZE_WINDOW:
        return container.get(require('./maximize_window_gesture_action').MaximizeWindowGestureAction);
      case GestureActionType.TOGGLE_FULLSCREEN:
        return container.get(require('./toggle_fullscreen_gesture_action').ToggleFullscreenGestureAction);
      default:
        throw new Error(`未対応のGestureActionType: ${type}`);
    }
  }
} 