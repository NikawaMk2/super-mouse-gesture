import { Container } from 'inversify';
import { GestureActionHandler } from '../services/gesture_action_handler';
import { DragActionHandler } from '../services/drag_action_handler';
import { MessageListener, IGestureActionHandler, IDragActionHandler } from '../services/message_listener';
import { ChromeTabOperator } from '../../common/provider/chrome_tab_operator';
import { SearchGoogleDragAction } from '../services/drag_action/search_google_drag_action';
import { SearchBingDragAction } from '../services/drag_action/search_bing_drag_action';
import { OpenAsUrlDragAction } from '../services/drag_action/open_as_url_drag_action';
import { CopyTextDragAction } from '../services/drag_action/copy_text_drag_action';
import { DownloadService } from '../services/download_service';
import { ClipboardService } from '../services/clipboard/clipboard_service';
import { OpenInBackgroundTabDragAction } from '../services/drag_action/open_in_background_tab_drag_action';
import { OpenInForegroundTabDragAction } from '../services/drag_action/open_in_foreground_tab_drag_action';
import { DownloadLinkDragAction } from '../services/drag_action/download_link_drag_action';
import { OpenImageInNewTabDragAction } from '../services/drag_action/open_image_in_new_tab_drag_action';
import { DownloadImageDragAction } from '../services/drag_action/download_image_drag_action';
import { SearchImageGoogleDragAction } from '../services/drag_action/search_image_google_drag_action';
import { CopyImageUrlDragAction } from '../services/drag_action/copy_image_url_drag_action';
import Logger from '../../common/logger/logger';

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
            container.bind('IClipboardService').to(ClipboardService).inSingletonScope();
            container.bind(CopyTextDragAction).toDynamicValue((ctx: any) => {
                const clipboardService = ctx.container.get('IClipboardService');
                return new CopyTextDragAction(clipboardService);
            }).inSingletonScope();
            container.bind('IDownloadService').to(DownloadService).inSingletonScope();
            container.bind(OpenInBackgroundTabDragAction).toDynamicValue((ctx: any) => {
                const tabOperator = ctx.container.get('ITabOperator');
                return new OpenInBackgroundTabDragAction(tabOperator);
            }).inSingletonScope();
            container.bind(OpenInForegroundTabDragAction).toDynamicValue((ctx: any) => {
                const tabOperator = ctx.container.get('ITabOperator');
                return new OpenInForegroundTabDragAction(tabOperator);
            }).inSingletonScope();
            container.bind(DownloadLinkDragAction).toDynamicValue((ctx: any) => {
                const downloadService = ctx.container.get('IDownloadService');
                return new DownloadLinkDragAction(downloadService);
            }).inSingletonScope();
            container.bind(OpenImageInNewTabDragAction).toDynamicValue((ctx: any) => {
                const tabOperator = ctx.container.get('ITabOperator');
                return new OpenImageInNewTabDragAction(tabOperator);
            }).inSingletonScope();
            container.bind(DownloadImageDragAction).toDynamicValue((ctx: any) => {
                const downloadService = ctx.container.get('IDownloadService');
                return new DownloadImageDragAction(downloadService);
            }).inSingletonScope();
            container.bind(SearchImageGoogleDragAction).toDynamicValue((ctx: any) => {
                const tabOperator = ctx.container.get('ITabOperator');
                return new SearchImageGoogleDragAction(tabOperator);
            }).inSingletonScope();
            container.bind(CopyImageUrlDragAction).toDynamicValue((ctx: any) => {
                const clipboardService = ctx.container.get('IClipboardService');
                return new CopyImageUrlDragAction(clipboardService);
            }).inSingletonScope();

            return container;
        } catch (error) {
            Logger.error('バックグラウンドコンテナ初期化エラー', { error });
            throw error;
        }
    }
} 