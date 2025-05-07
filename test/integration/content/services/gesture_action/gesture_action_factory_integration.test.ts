import { ContentContainerProvider } from '../../../../../src/content/provider/content_container_provider';
import { GestureActionFactory } from '../../../../../src/content/services/gesture_action/gesture_action_factory';
import { GestureActionType } from '../../../../../src/content/services/gesture_action/gesture_action_type';
import { GoBackGestureAction } from '../../../../../src/content/services/gesture_action/go_back_gesture_action';
import { ForwardGestureAction } from '../../../../../src/content/services/gesture_action/forward_gesture_action';
import { ReloadPageGestureAction } from '../../../../../src/content/services/gesture_action/reload_page_gesture_action';
import { StopLoadingGestureAction } from '../../../../../src/content/services/gesture_action/stop_loading_gesture_action';
import { ScrollToTopGestureAction } from '../../../../../src/content/services/gesture_action/scroll_to_top_gesture_action';
import { ScrollToBottomGestureAction } from '../../../../../src/content/services/gesture_action/scroll_to_bottom_gesture_action';
import { ZoomInGestureAction } from '../../../../../src/content/services/gesture_action/zoom_in_gesture_action';
import { ZoomOutGestureAction } from '../../../../../src/content/services/gesture_action/zoom_out_gesture_action';
import { ShowFindBarGestureAction } from '../../../../../src/content/services/gesture_action/show_find_bar_gesture_action';
import { NewTabGestureAction } from '../../../../../src/content/services/gesture_action/new_tab_gesture_action';
import { CloseTabGestureAction } from '../../../../../src/content/services/gesture_action/close_tab_gesture_action';
import { CloseTabToLeftGestureAction } from '../../../../../src/content/services/gesture_action/close_tab_to_left_gesture_action';
import { CloseTabToRightGestureAction } from '../../../../../src/content/services/gesture_action/close_tab_to_right_gesture_action';
import { NextTabGestureAction } from '../../../../../src/content/services/gesture_action/next_tab_gesture_action';
import { PrevTabGestureAction } from '../../../../../src/content/services/gesture_action/prev_tab_gesture_action';
import { ReopenClosedTabGestureAction } from '../../../../../src/content/services/gesture_action/reopen_closed_tab_gesture_action';
import { DuplicateTabGestureAction } from '../../../../../src/content/services/gesture_action/duplicate_tab_gesture_action';
import { PinTabGestureAction } from '../../../../../src/content/services/gesture_action/pin_tab_gesture_action';
import { MuteTabGestureAction } from '../../../../../src/content/services/gesture_action/mute_tab_gesture_action';
import { NewWindowGestureAction } from '../../../../../src/content/services/gesture_action/new_window_gesture_action';
import { NewIncognitoWindowGestureAction } from '../../../../../src/content/services/gesture_action/new_incognito_window_gesture_action';
import { CloseWindowGestureAction } from '../../../../../src/content/services/gesture_action/close_window_gesture_action';
import { MinimizeWindowGestureAction } from '../../../../../src/content/services/gesture_action/minimize_window_gesture_action';
import { MaximizeWindowGestureAction } from '../../../../../src/content/services/gesture_action/maximize_window_gesture_action';
import { ToggleFullscreenGestureAction } from '../../../../../src/content/services/gesture_action/toggle_fullscreen_gesture_action';
import { NoneGestureAction } from '../../../../../src/content/services/gesture_action/none_gesture_action';

describe('GestureActionFactory (content integration)', () => {
    let container: ReturnType<ContentContainerProvider['getContainer']>;

    beforeEach(() => {
        // 本物のDIコンテナを取得
        container = new ContentContainerProvider().getContainer();
    });

    it('全てのGestureActionTypeで正しいクラスのインスタンスが返ること', () => {
        expect(GestureActionFactory.create(GestureActionType.GO_BACK, container)).toBeInstanceOf(GoBackGestureAction);
        expect(GestureActionFactory.create(GestureActionType.FORWARD, container)).toBeInstanceOf(ForwardGestureAction);
        expect(GestureActionFactory.create(GestureActionType.RELOAD_PAGE, container)).toBeInstanceOf(ReloadPageGestureAction);
        expect(GestureActionFactory.create(GestureActionType.STOP_LOADING, container)).toBeInstanceOf(StopLoadingGestureAction);
        expect(GestureActionFactory.create(GestureActionType.SCROLL_TO_TOP, container)).toBeInstanceOf(ScrollToTopGestureAction);
        expect(GestureActionFactory.create(GestureActionType.SCROLL_TO_BOTTOM, container)).toBeInstanceOf(ScrollToBottomGestureAction);
        expect(GestureActionFactory.create(GestureActionType.ZOOM_IN, container)).toBeInstanceOf(ZoomInGestureAction);
        expect(GestureActionFactory.create(GestureActionType.ZOOM_OUT, container)).toBeInstanceOf(ZoomOutGestureAction);
        expect(GestureActionFactory.create(GestureActionType.SHOW_FIND_BAR, container)).toBeInstanceOf(ShowFindBarGestureAction);
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
        expect(GestureActionFactory.create(GestureActionType.NONE, container)).toBeInstanceOf(NoneGestureAction);
    });
}); 