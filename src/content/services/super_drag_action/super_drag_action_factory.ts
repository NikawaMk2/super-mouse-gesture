import { Container } from 'inversify';
import { SuperDragAction } from './super_drag_action';
import { SuperDragActionType, SuperDragActionType as SuperDragActionTypeAlias } from './super_drag_action_type';
import { SearchGoogleDragAction } from './text/search_google_drag_action';
import { SearchBingDragAction } from './text/search_bing_drag_action';
import { OpenAsUrlDragAction } from './text/open_as_url_drag_action';
import { CopyTextDragAction } from './text/copy_text_drag_action';
import { OpenInBackgroundTabDragAction } from './link/open_in_background_tab_drag_action';
import { OpenInForegroundTabDragAction } from './link/open_in_foreground_tab_drag_action';
import { CopyLinkUrlDragAction } from './link/copy_link_url_drag_action';
import { OpenImageInNewTabDragAction } from './image/open_image_in_new_tab_drag_action';
import { DownloadImageDragAction } from './image/download_image_drag_action';
import { SearchImageGoogleDragAction } from './image/search_image_google_drag_action';
import { CopyImageUrlDragAction } from './image/copy_image_url_drag_action';

export class SuperDragActionFactory {
    static create(actionName: SuperDragActionTypeAlias, container: Container): SuperDragAction {
        switch (actionName) {
            case SuperDragActionType.SEARCH_GOOGLE:
                return container.get(SearchGoogleDragAction);
            case SuperDragActionType.SEARCH_BING:
                return container.get(SearchBingDragAction);
            case SuperDragActionType.OPEN_AS_URL:
                return container.get(OpenAsUrlDragAction);
            case SuperDragActionType.COPY_TEXT:
                return container.get(CopyTextDragAction);
            case SuperDragActionType.OPEN_IN_BACKGROUND_TAB:
                return container.get(OpenInBackgroundTabDragAction);
            case SuperDragActionType.OPEN_IN_FOREGROUND_TAB:
                return container.get(OpenInForegroundTabDragAction);
            case SuperDragActionType.COPY_LINK_URL:
                return container.get(CopyLinkUrlDragAction);
            case SuperDragActionType.OPEN_IMAGE_IN_NEW_TAB:
                return container.get(OpenImageInNewTabDragAction);
            case SuperDragActionType.DOWNLOAD_IMAGE:
                return container.get(DownloadImageDragAction);
            case SuperDragActionType.SEARCH_IMAGE_GOOGLE:
                return container.get(SearchImageGoogleDragAction);
            case SuperDragActionType.COPY_IMAGE_URL:
                return container.get(CopyImageUrlDragAction);
            default:
                throw new Error(`未対応のSuperDragAction: ${actionName}`);
        }
    }
}
