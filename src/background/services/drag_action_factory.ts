import { DragAction } from './drag_action/drag_action';
import { SearchGoogleDragAction } from './drag_action/search_google_drag_action';
import { SearchBingDragAction } from './drag_action/search_bing_drag_action';
import { OpenAsUrlDragAction } from './drag_action/open_as_url_drag_action';
import { CopyTextDragAction } from './drag_action/copy_text_drag_action';
import { OpenInBackgroundTabDragAction } from './drag_action/open_in_background_tab_drag_action';
import { OpenInForegroundTabDragAction } from './drag_action/open_in_foreground_tab_drag_action';
import { DownloadLinkDragAction } from './drag_action/download_link_drag_action';
import { CopyLinkUrlDragAction } from './drag_action/copy_link_url_drag_action';
import { OpenImageInNewTabDragAction } from './drag_action/open_image_in_new_tab_drag_action';
import { DownloadImageDragAction } from './drag_action/download_image_drag_action';
import { SearchImageGoogleDragAction } from './drag_action/search_image_google_drag_action';
import { CopyImageUrlDragAction } from './drag_action/copy_image_url_drag_action';
import { Container } from 'inversify';
import { DragActionType } from './drag_action/drag_action_type';

export class DragActionFactory {
    static create(actionName: string, container: Container): DragAction {
        switch (actionName as DragActionType) {
            case DragActionType.SEARCH_GOOGLE:
                return container.get(SearchGoogleDragAction);
            case DragActionType.SEARCH_BING:
                return container.get(SearchBingDragAction);
            case DragActionType.OPEN_AS_URL:
                return container.get(OpenAsUrlDragAction);
            case DragActionType.COPY_TEXT:
                return container.get(CopyTextDragAction);
            case DragActionType.OPEN_IN_BACKGROUND_TAB:
                return container.get(OpenInBackgroundTabDragAction);
            case DragActionType.OPEN_IN_FOREGROUND_TAB:
                return container.get(OpenInForegroundTabDragAction);
            case DragActionType.DOWNLOAD_LINK:
                return container.get(DownloadLinkDragAction);
            case DragActionType.COPY_LINK_URL:
                return container.get(CopyLinkUrlDragAction);
            case DragActionType.OPEN_IMAGE_IN_NEW_TAB:
                return container.get(OpenImageInNewTabDragAction);
            case DragActionType.DOWNLOAD_IMAGE:
                return container.get(DownloadImageDragAction);
            case DragActionType.SEARCH_IMAGE_GOOGLE:
                return container.get(SearchImageGoogleDragAction);
            case DragActionType.COPY_IMAGE_URL:
                return container.get(CopyImageUrlDragAction);
            // TODO: 他のアクションクラスをここに追加
            default:
                throw new Error(`未対応のDragActionType: ${actionName}`);
        }
    }
} 