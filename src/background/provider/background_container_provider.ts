import { Container } from 'inversify';
import { GestureActionHandler } from '../services/gesture_action_handler';
import { DragActionHandler } from '../services/drag_action_handler';
import { MessageListener, IGestureActionHandler, IDragActionHandler } from '../services/message_listener';
import { ChromeTabOperator } from '../../common/provider/chrome_tab_operator';
import { SearchGoogleDragAction } from '../services/drag_action/search_google_drag_action';
import { SearchBingDragAction } from '../services/drag_action/search_bing_drag_action';
import { OpenAsUrlDragAction } from '../services/drag_action/open_as_url_drag_action';
import { DownloadService } from '../services/download_service';
import { OpenInBackgroundTabDragAction } from '../services/drag_action/open_in_background_tab_drag_action';
import { OpenInForegroundTabDragAction } from '../services/drag_action/open_in_foreground_tab_drag_action';
import { OpenImageInNewTabDragAction } from '../services/drag_action/open_image_in_new_tab_drag_action';

import { SearchImageGoogleDragAction } from '../services/drag_action/search_image_google_drag_action';
import Logger from '../../common/logger/logger';
import { NewTabGestureAction } from '../services/gesture_action/new_tab_gesture_action';
import { CloseTabGestureAction } from '../services/gesture_action/close_tab_gesture_action';
import { CloseTabToLeftGestureAction } from '../services/gesture_action/close_tab_to_left_gesture_action';
import { CloseTabToRightGestureAction } from '../services/gesture_action/close_tab_to_right_gesture_action';
import { NextTabGestureAction } from '../services/gesture_action/next_tab_gesture_action';
import { PrevTabGestureAction } from '../services/gesture_action/prev_tab_gesture_action';
import { ReopenClosedTabGestureAction } from '../services/gesture_action/reopen_closed_tab_gesture_action';
import { DuplicateTabGestureAction } from '../services/gesture_action/duplicate_tab_gesture_action';
import { PinTabGestureAction } from '../services/gesture_action/pin_tab_gesture_action';
import { MuteTabGestureAction } from '../services/gesture_action/mute_tab_gesture_action';
import { NewWindowGestureAction } from '../services/gesture_action/new_window_gesture_action';
import { NewIncognitoWindowGestureAction } from '../services/gesture_action/new_incognito_window_gesture_action';
import { CloseWindowGestureAction } from '../services/gesture_action/close_window_gesture_action';
import { MinimizeWindowGestureAction } from '../services/gesture_action/minimize_window_gesture_action';
import { MaximizeWindowGestureAction } from '../services/gesture_action/maximize_window_gesture_action';
import { ToggleFullscreenGestureAction } from '../services/gesture_action/toggle_fullscreen_gesture_action';
import { ChromeWindowOperator } from '../services/gesture_action/chrome_window_operator';

export class BackgroundContainerProvider {
    private static container: Container | null = null;

    getContainer(): Container {
        if (BackgroundContainerProvider.container === null) {
            BackgroundContainerProvider.container = this.initialize();
        }
        return BackgroundContainerProvider.container;
    }

    private initialize(): Container {
        try {
            const container = new Container();
            // サービスクラスをシングルトンでbind
            container.bind<IGestureActionHandler>('IGestureActionHandler').to(GestureActionHandler).inSingletonScope();
            container.bind<IDragActionHandler>('IDragActionHandler').to(DragActionHandler).inSingletonScope();
            container.bind(MessageListener).toSelf().inSingletonScope();
            container.bind('ITabOperator').to(ChromeTabOperator).inSingletonScope();
            container.bind(SearchGoogleDragAction).toSelf().inSingletonScope();
            container.bind(SearchBingDragAction).toSelf().inSingletonScope();
            container.bind(OpenAsUrlDragAction).toSelf().inSingletonScope();
            container.bind('IDownloadService').to(DownloadService).inSingletonScope();
            container.bind(OpenInBackgroundTabDragAction).toSelf().inSingletonScope();
            container.bind(OpenInForegroundTabDragAction).toSelf().inSingletonScope();
            container.bind(OpenImageInNewTabDragAction).toSelf().inSingletonScope();

            container.bind(SearchImageGoogleDragAction).toSelf().inSingletonScope();
            container.bind(NewTabGestureAction).toSelf().inSingletonScope();
            container.bind(CloseTabGestureAction).toSelf().inSingletonScope();
            container.bind(CloseTabToLeftGestureAction).toSelf().inSingletonScope();
            container.bind(CloseTabToRightGestureAction).toSelf().inSingletonScope();
            container.bind(NextTabGestureAction).toSelf().inSingletonScope();
            container.bind(PrevTabGestureAction).toSelf().inSingletonScope();
            container.bind(ReopenClosedTabGestureAction).toSelf().inSingletonScope();
            container.bind(DuplicateTabGestureAction).toSelf().inSingletonScope();
            container.bind(PinTabGestureAction).toSelf().inSingletonScope();
            container.bind(MuteTabGestureAction).toSelf().inSingletonScope();
            container.bind(NewWindowGestureAction).toSelf().inSingletonScope();
            container.bind(NewIncognitoWindowGestureAction).toSelf().inSingletonScope();
            container.bind(CloseWindowGestureAction).toSelf().inSingletonScope();
            container.bind(MinimizeWindowGestureAction).toSelf().inSingletonScope();
            container.bind(MaximizeWindowGestureAction).toSelf().inSingletonScope();
            container.bind(ToggleFullscreenGestureAction).toSelf().inSingletonScope();
            container.bind('IWindowOperator').to(ChromeWindowOperator).inSingletonScope();

            return container;
        } catch (error) {
            Logger.error('バックグラウンドコンテナ初期化エラー', { error });
            throw error;
        }
    }
} 