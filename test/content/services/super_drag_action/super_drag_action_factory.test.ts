import { SuperDragActionFactory } from '../../../../src/content/services/super_drag_action/super_drag_action_factory';
import { SuperDragActionType } from '../../../../src/content/services/super_drag_action/super_drag_action_type';
import { SearchGoogleDragAction } from '../../../../src/content/services/super_drag_action/text/search_google_drag_action';
import { SearchBingDragAction } from '../../../../src/content/services/super_drag_action/text/search_bing_drag_action';
import { OpenAsUrlDragAction } from '../../../../src/content/services/super_drag_action/text/open_as_url_drag_action';
import { CopyTextDragAction } from '../../../../src/content/services/super_drag_action/text/copy_text_drag_action';
import { OpenInBackgroundTabDragAction } from '../../../../src/content/services/super_drag_action/link/open_in_background_tab_drag_action';
import { OpenInForegroundTabDragAction } from '../../../../src/content/services/super_drag_action/link/open_in_foreground_tab_drag_action';
import { CopyLinkUrlDragAction } from '../../../../src/content/services/super_drag_action/link/copy_link_url_drag_action';
import { OpenImageInNewTabDragAction } from '../../../../src/content/services/super_drag_action/image/open_image_in_new_tab_drag_action';
import { SearchImageGoogleDragAction } from '../../../../src/content/services/super_drag_action/image/search_image_google_drag_action';
import { CopyImageUrlDragAction } from '../../../../src/content/services/super_drag_action/image/copy_image_url_drag_action';
import { NoneDragAction } from '../../../../src/content/services/super_drag_action/none/none_drag_action';

const mockContainer = {
    get: (clazz: any) => new clazz(),
} as any;

describe('SuperDragActionFactory', () => {
    it('各アクションタイプで正しいクラスインスタンスを返すこと', () => {
        expect(SuperDragActionFactory.create(SuperDragActionType.SEARCH_GOOGLE, mockContainer)).toBeInstanceOf(SearchGoogleDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.SEARCH_BING, mockContainer)).toBeInstanceOf(SearchBingDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.OPEN_AS_URL, mockContainer)).toBeInstanceOf(OpenAsUrlDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.COPY_TEXT, mockContainer)).toBeInstanceOf(CopyTextDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.OPEN_IN_BACKGROUND_TAB, mockContainer)).toBeInstanceOf(OpenInBackgroundTabDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.OPEN_IN_FOREGROUND_TAB, mockContainer)).toBeInstanceOf(OpenInForegroundTabDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.COPY_LINK_URL, mockContainer)).toBeInstanceOf(CopyLinkUrlDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.OPEN_IMAGE_IN_NEW_TAB, mockContainer)).toBeInstanceOf(OpenImageInNewTabDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.SEARCH_IMAGE_GOOGLE, mockContainer)).toBeInstanceOf(SearchImageGoogleDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.COPY_IMAGE_URL, mockContainer)).toBeInstanceOf(CopyImageUrlDragAction);
        expect(SuperDragActionFactory.create(SuperDragActionType.NONE, mockContainer)).toBeInstanceOf(NoneDragAction);
    });

    it('未定義のアクションタイプを渡すと例外を投げること', () => {
        // @ts-expect-error: 型安全のため通常は渡せないが、テストのためanyで渡す
        expect(() => SuperDragActionFactory.create('unknownAction', mockContainer)).toThrow();
    });
}); 