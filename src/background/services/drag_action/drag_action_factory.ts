import { DragAction } from './drag_action';
import { SearchGoogleDragAction } from './search_google_drag_action';
import { SearchBingDragAction } from './search_bing_drag_action';
import { OpenAsUrlDragAction } from './open_as_url_drag_action';
import { OpenInBackgroundTabDragAction } from './open_in_background_tab_drag_action';
import { OpenInForegroundTabDragAction } from './open_in_foreground_tab_drag_action';
import { OpenImageInNewTabDragAction } from './open_image_in_new_tab_drag_action';
import { SearchImageGoogleDragAction } from './search_image_google_drag_action';
import { Container } from 'inversify';
import { DragActionType } from './drag_action_type';

export class DragActionFactory {
    static create(actionName: string, container: Container): DragAction {
        switch (actionName as DragActionType) {
            case DragActionType.SEARCH_GOOGLE:
                return container.get(SearchGoogleDragAction);
            case DragActionType.SEARCH_BING:
                return container.get(SearchBingDragAction);
            case DragActionType.OPEN_AS_URL:
                return container.get(OpenAsUrlDragAction);
            case DragActionType.OPEN_IN_BACKGROUND_TAB:
                return container.get(OpenInBackgroundTabDragAction);
            case DragActionType.OPEN_IN_FOREGROUND_TAB:
                return container.get(OpenInForegroundTabDragAction);
            case DragActionType.OPEN_IMAGE_IN_NEW_TAB:
                return container.get(OpenImageInNewTabDragAction);
            case DragActionType.SEARCH_IMAGE_GOOGLE:
                return container.get(SearchImageGoogleDragAction);
            default:
                throw new Error(`未対応のDragActionType: ${actionName}`);
        }
    }
} 