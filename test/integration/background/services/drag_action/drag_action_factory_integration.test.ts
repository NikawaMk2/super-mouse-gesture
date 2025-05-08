import { BackgroundContainerProvider } from '../../../../../src/background/provider/background_container_provider';
import { DragActionFactory } from '../../../../../src/background/services/drag_action/drag_action_factory';
import { DragActionType } from '../../../../../src/background/services/drag_action/drag_action_type';
import { SearchGoogleDragAction } from '../../../../../src/background/services/drag_action/search_google_drag_action';
import { SearchBingDragAction } from '../../../../../src/background/services/drag_action/search_bing_drag_action';
import { OpenAsUrlDragAction } from '../../../../../src/background/services/drag_action/open_as_url_drag_action';
import { OpenInBackgroundTabDragAction } from '../../../../../src/background/services/drag_action/open_in_background_tab_drag_action';
import { OpenInForegroundTabDragAction } from '../../../../../src/background/services/drag_action/open_in_foreground_tab_drag_action';
import { DownloadLinkDragAction } from '../../../../../src/background/services/drag_action/download_link_drag_action';
import { OpenImageInNewTabDragAction } from '../../../../../src/background/services/drag_action/open_image_in_new_tab_drag_action';
import { DownloadImageDragAction } from '../../../../../src/background/services/drag_action/download_image_drag_action';
import { SearchImageGoogleDragAction } from '../../../../../src/background/services/drag_action/search_image_google_drag_action';

describe('DragActionFactory (background integration)', () => {
    let container: ReturnType<BackgroundContainerProvider['getContainer']>;

    beforeEach(() => {
        // 本物のDIコンテナを取得
        container = new BackgroundContainerProvider().getContainer();
    });

    it('全てのDragActionTypeで正しいクラスのインスタンスが返ること', () => {
        expect(DragActionFactory.create(DragActionType.SEARCH_GOOGLE, container)).toBeInstanceOf(SearchGoogleDragAction);
        expect(DragActionFactory.create(DragActionType.SEARCH_BING, container)).toBeInstanceOf(SearchBingDragAction);
        expect(DragActionFactory.create(DragActionType.OPEN_AS_URL, container)).toBeInstanceOf(OpenAsUrlDragAction);
        expect(DragActionFactory.create(DragActionType.OPEN_IN_BACKGROUND_TAB, container)).toBeInstanceOf(OpenInBackgroundTabDragAction);
        expect(DragActionFactory.create(DragActionType.OPEN_IN_FOREGROUND_TAB, container)).toBeInstanceOf(OpenInForegroundTabDragAction);
        expect(DragActionFactory.create(DragActionType.DOWNLOAD_LINK, container)).toBeInstanceOf(DownloadLinkDragAction);
        expect(DragActionFactory.create(DragActionType.OPEN_IMAGE_IN_NEW_TAB, container)).toBeInstanceOf(OpenImageInNewTabDragAction);
        expect(DragActionFactory.create(DragActionType.DOWNLOAD_IMAGE, container)).toBeInstanceOf(DownloadImageDragAction);
        expect(DragActionFactory.create(DragActionType.SEARCH_IMAGE_GOOGLE, container)).toBeInstanceOf(SearchImageGoogleDragAction);
    });
}); 