// DIコンテナの初期化・呼び出しへの提供を行うクラス
import { Container } from 'inversify';
import Logger from '../logger/logger';
// マウスジェスチャアクションの各クラスをimport
import { GoBackGestureAction } from '../../content/services/gesture_action/go_back_gesture_action';
import { ForwardGestureAction } from '../../content/services/gesture_action/forward_gesture_action';
import { ReloadPageGestureAction } from '../../content/services/gesture_action/reload_page_gesture_action';
import { StopLoadingGestureAction } from '../../content/services/gesture_action/stop_loading_gesture_action';
import { ScrollToTopGestureAction } from '../../content/services/gesture_action/scroll_to_top_gesture_action';
import { ScrollToBottomGestureAction } from '../../content/services/gesture_action/scroll_to_bottom_gesture_action';
import { ZoomInGestureAction } from '../../content/services/gesture_action/zoom_in_gesture_action';
import { ZoomOutGestureAction } from '../../content/services/gesture_action/zoom_out_gesture_action';
import { ShowFindBarGestureAction } from '../../content/services/gesture_action/show_find_bar_gesture_action';
import { NewTabGestureAction } from '../../content/services/gesture_action/new_tab_gesture_action';
import { CloseTabGestureAction } from '../../content/services/gesture_action/close_tab_gesture_action';
import { CloseTabToLeftGestureAction } from '../../content/services/gesture_action/close_tab_to_left_gesture_action';
import { CloseTabToRightGestureAction } from '../../content/services/gesture_action/close_tab_to_right_gesture_action';
import { NextTabGestureAction } from '../../content/services/gesture_action/next_tab_gesture_action';
import { PrevTabGestureAction } from '../../content/services/gesture_action/prev_tab_gesture_action';
import { ReopenClosedTabGestureAction } from '../../content/services/gesture_action/reopen_closed_tab_gesture_action';
import { DuplicateTabGestureAction } from '../../content/services/gesture_action/duplicate_tab_gesture_action';
import { PinTabGestureAction } from '../../content/services/gesture_action/pin_tab_gesture_action';
import { MuteTabGestureAction } from '../../content/services/gesture_action/mute_tab_gesture_action';
import { NewWindowGestureAction } from '../../content/services/gesture_action/new_window_gesture_action';
import { NewIncognitoWindowGestureAction } from '../../content/services/gesture_action/new_incognito_window_gesture_action';
import { CloseWindowGestureAction } from '../../content/services/gesture_action/close_window_gesture_action';
import { MinimizeWindowGestureAction } from '../../content/services/gesture_action/minimize_window_gesture_action';
import { MaximizeWindowGestureAction } from '../../content/services/gesture_action/maximize_window_gesture_action';
import { ToggleFullscreenGestureAction } from '../../content/services/gesture_action/toggle_fullscreen_gesture_action';
// SuperDragAction（画像）
import { DownloadImageDragAction } from '../../content/services/super_drag_action/image/download_image_drag_action';
import { OpenImageInNewTabDragAction } from '../../content/services/super_drag_action/image/open_image_in_new_tab_drag_action';
import { SearchImageGoogleDragAction } from '../../content/services/super_drag_action/image/search_image_google_drag_action';
import { CopyImageUrlDragAction } from '../../content/services/super_drag_action/image/copy_image_url_drag_action';
// SuperDragAction（リンク）
import { OpenInBackgroundTabDragAction } from '../../content/services/super_drag_action/link/open_in_background_tab_drag_action';
import { OpenInForegroundTabDragAction } from '../../content/services/super_drag_action/link/open_in_foreground_tab_drag_action';
import { CopyLinkUrlDragAction } from '../../content/services/super_drag_action/link/copy_link_url_drag_action';
import { DownloadLinkDragAction } from '../../content/services/super_drag_action/link/download_link_drag_action';
// SuperDragAction（テキスト）
import { SearchGoogleDragAction } from '../../content/services/super_drag_action/text/search_google_drag_action';
import { CopyTextDragAction } from '../../content/services/super_drag_action/text/copy_text_drag_action';
import { OpenAsUrlDragAction } from '../../content/services/super_drag_action/text/open_as_url_drag_action';
import { SearchBingDragAction } from '../../content/services/super_drag_action/text/search_bing_drag_action';

export class ContainerProvider {
    private static container: Container | null = null;

    public static getContainer(): Container {
        if (this.container === null) {
            this.container = this.initialize();
        }
        return this.container;
    }

    private static initialize(): Container {
        try {
            const container = new Container();

            // マウスジェスチャアクションをコンテナに登録
            container.bind(GoBackGestureAction).toSelf().inSingletonScope();
            container.bind(ForwardGestureAction).toSelf().inSingletonScope();
            container.bind(ReloadPageGestureAction).toSelf().inSingletonScope();
            container.bind(StopLoadingGestureAction).toSelf().inSingletonScope();
            container.bind(ScrollToTopGestureAction).toSelf().inSingletonScope();
            container.bind(ScrollToBottomGestureAction).toSelf().inSingletonScope();
            container.bind(ZoomInGestureAction).toSelf().inSingletonScope();
            container.bind(ZoomOutGestureAction).toSelf().inSingletonScope();
            container.bind(ShowFindBarGestureAction).toSelf().inSingletonScope();
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

            // --- SuperDragAction（画像） ---
            container.bind(DownloadImageDragAction).toSelf().inSingletonScope();
            container.bind(OpenImageInNewTabDragAction).toSelf().inSingletonScope();
            container.bind(SearchImageGoogleDragAction).toSelf().inSingletonScope();
            container.bind(CopyImageUrlDragAction).toSelf().inSingletonScope();
            // --- SuperDragAction（リンク） ---
            container.bind(OpenInBackgroundTabDragAction).toSelf().inSingletonScope();
            container.bind(OpenInForegroundTabDragAction).toSelf().inSingletonScope();
            container.bind(CopyLinkUrlDragAction).toSelf().inSingletonScope();
            container.bind(DownloadLinkDragAction).toSelf().inSingletonScope();
            // --- SuperDragAction（テキスト） ---
            container.bind(SearchGoogleDragAction).toSelf().inSingletonScope();
            container.bind(CopyTextDragAction).toSelf().inSingletonScope();
            container.bind(OpenAsUrlDragAction).toSelf().inSingletonScope();
            container.bind(SearchBingDragAction).toSelf().inSingletonScope();

            return container;
        } catch (error) {
            Logger.error(`バックグラウンドコンテナ初期化エラー: ${error}`);
            throw error;
        }
    }
}
