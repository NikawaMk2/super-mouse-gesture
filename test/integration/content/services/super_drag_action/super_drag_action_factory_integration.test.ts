import { ContentContainerProvider } from '../../../../../src/content/provider/content_container_provider';
import { SuperDragActionFactory } from '../../../../../src/content/services/super_drag_action/super_drag_action_factory';
import { SuperDragActionType } from '../../../../../src/content/services/super_drag_action/super_drag_action_type';
import { SearchGoogleDragAction } from '../../../../../src/content/services/super_drag_action/text/search_google_drag_action';
import { SearchBingDragAction } from '../../../../../src/content/services/super_drag_action/text/search_bing_drag_action';
import { OpenAsUrlDragAction } from '../../../../../src/content/services/super_drag_action/text/open_as_url_drag_action';
import { CopyTextDragAction } from '../../../../../src/content/services/super_drag_action/text/copy_text_drag_action';
import { OpenInBackgroundTabDragAction } from '../../../../../src/content/services/super_drag_action/link/open_in_background_tab_drag_action';
import { OpenInForegroundTabDragAction } from '../../../../../src/content/services/super_drag_action/link/open_in_foreground_tab_drag_action';
import { CopyLinkUrlDragAction } from '../../../../../src/content/services/super_drag_action/link/copy_link_url_drag_action';
import { OpenImageInNewTabDragAction } from '../../../../../src/content/services/super_drag_action/image/open_image_in_new_tab_drag_action';

import { SearchImageGoogleDragAction } from '../../../../../src/content/services/super_drag_action/image/search_image_google_drag_action';
import { CopyImageUrlDragAction } from '../../../../../src/content/services/super_drag_action/image/copy_image_url_drag_action';

describe('SuperDragActionFactory (content integration)', () => {
    let container: ReturnType<ContentContainerProvider['getContainer']>;

    beforeEach(() => {
        // 本物のDIコンテナを取得
        container = new ContentContainerProvider().getContainer();
    });

    it('全てのSuperDragActionTypeで正しいクラスのインスタンスが返ること', () => {
        expect(SuperDragActionFactory.create(SuperDragActionType.SEARCH_GOOGLE, container)).toBeInstanceOf(SearchGoogleDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.SEARCH_BING, container)).toBeInstanceOf(SearchBingDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.OPEN_AS_URL, container)).toBeInstanceOf(OpenAsUrlDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.COPY_TEXT, container)).toBeInstanceOf(CopyTextDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.OPEN_IN_BACKGROUND_TAB, container)).toBeInstanceOf(OpenInBackgroundTabDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.OPEN_IN_FOREGROUND_TAB, container)).toBeInstanceOf(OpenInForegroundTabDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.COPY_LINK_URL, container)).toBeInstanceOf(CopyLinkUrlDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.OPEN_IMAGE_IN_NEW_TAB, container)).toBeInstanceOf(OpenImageInNewTabDragAction);

        expect(SuperDragActionFactory.create(SuperDragActionType.SEARCH_IMAGE_GOOGLE, container)).toBeInstanceOf(SearchImageGoogleDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.COPY_IMAGE_URL, container)).toBeInstanceOf(CopyImageUrlDragAction);
    });
}); 