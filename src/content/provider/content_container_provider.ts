// DIコンテナの初期化・呼び出しへの提供を行うクラス
import { Container } from 'inversify';
import Logger from '../../common/logger/logger';
// マウスジェスチャアクションの各クラスをimport
import { GoBackGestureAction } from '../services/gesture_action/go_back_gesture_action';
import { ForwardGestureAction } from '../services/gesture_action/forward_gesture_action';
import { ReloadPageGestureAction } from '../services/gesture_action/reload_page_gesture_action';
import { StopLoadingGestureAction } from '../services/gesture_action/stop_loading_gesture_action';
import { ScrollToTopGestureAction } from '../services/gesture_action/scroll_to_top_gesture_action';
import { ScrollToBottomGestureAction } from '../services/gesture_action/scroll_to_bottom_gesture_action';
import { ZoomInGestureAction } from '../services/gesture_action/zoom_in_gesture_action';
import { ZoomOutGestureAction } from '../services/gesture_action/zoom_out_gesture_action';
import { ShowFindBarGestureAction } from '../services/gesture_action/show_find_bar_gesture_action';
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
// SuperDragAction（画像）

import { OpenImageInNewTabDragAction } from '../services/super_drag_action/image/open_image_in_new_tab_drag_action';
import { SearchImageGoogleDragAction } from '../services/super_drag_action/image/search_image_google_drag_action';
import { CopyImageUrlDragAction } from '../services/super_drag_action/image/copy_image_url_drag_action';
// SuperDragAction（リンク）
import { OpenInBackgroundTabDragAction } from '../services/super_drag_action/link/open_in_background_tab_drag_action';
import { OpenInForegroundTabDragAction } from '../services/super_drag_action/link/open_in_foreground_tab_drag_action';
import { CopyLinkUrlDragAction } from '../services/super_drag_action/link/copy_link_url_drag_action';
// SuperDragAction（テキスト）
import { SearchGoogleDragAction } from '../services/super_drag_action/text/search_google_drag_action';
import { CopyTextDragAction } from '../services/super_drag_action/text/copy_text_drag_action';
import { OpenAsUrlDragAction } from '../services/super_drag_action/text/open_as_url_drag_action';
import { SearchBingDragAction } from '../services/super_drag_action/text/search_bing_drag_action';
import { IContainerProvider } from '../../common/provider/i_container_provider';
import { NoneGestureAction } from '../services/gesture_action/none_gesture_action';
import { ClipboardService } from '../services/clipboard/clipboard_service';
import { IClipboardService } from '../services/clipboard/clipboard_service_interface';
import { ChromeMessageSender } from '../services/message/message_sender';

export class ContentContainerProvider implements IContainerProvider {
    private static container: Container | null = null;

    getContainer(): Container {
        if (ContentContainerProvider.container === null) {
            ContentContainerProvider.container = this.initialize();
        }
        return ContentContainerProvider.container;
    }

    private initialize(): Container {
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
            container.bind(NoneGestureAction).toSelf().inSingletonScope();

            // --- SuperDragAction（画像） ---

            container.bind(OpenImageInNewTabDragAction).toDynamicValue(ctx => {
                const sender = ctx.get<ChromeMessageSender>('ChromeMessageSender');
                return new OpenImageInNewTabDragAction(sender);
            }).inSingletonScope();
            container.bind(SearchImageGoogleDragAction).toDynamicValue(ctx => {
                const sender = ctx.get<ChromeMessageSender>('ChromeMessageSender');
                return new SearchImageGoogleDragAction(sender);
            }).inSingletonScope();
            container.bind(CopyImageUrlDragAction).toSelf().inSingletonScope();
            // --- SuperDragAction（リンク） ---
            container.bind(OpenInBackgroundTabDragAction).toSelf().inSingletonScope();
            container.bind(OpenInForegroundTabDragAction).toSelf().inSingletonScope();
            container.bind(CopyLinkUrlDragAction).toSelf().inSingletonScope();
            // --- SuperDragAction（テキスト） ---
            container.bind(SearchGoogleDragAction).toDynamicValue(ctx => {
                const sender = ctx.get<ChromeMessageSender>('ChromeMessageSender');
                return new SearchGoogleDragAction(sender);
            }).inSingletonScope();
            container.bind(CopyTextDragAction).toSelf().inSingletonScope();
            container.bind(OpenAsUrlDragAction).toDynamicValue(ctx => {
                const sender = ctx.get<ChromeMessageSender>('ChromeMessageSender');
                return new OpenAsUrlDragAction(sender);
            }).inSingletonScope();
            container.bind(SearchBingDragAction).toDynamicValue(ctx => {
                const sender = ctx.get<ChromeMessageSender>('ChromeMessageSender');
                return new SearchBingDragAction(sender);
            }).inSingletonScope();

            // --- ClipboardService ---
            container.bind<IClipboardService>('IClipboardService').to(ClipboardService).inSingletonScope();

            // --- MessageSender ---
            container.bind<ChromeMessageSender>('ChromeMessageSender').to(ChromeMessageSender).inSingletonScope();

            return container;
        } catch (error) {
            Logger.error(`コンテンツスクリプト用コンテナ初期化エラー: ${error}`);
            throw error;
        }
    }
}
