import 'reflect-metadata';
import { Container } from 'inversify';
import { DragActionFactory } from '../../../../src/background/services/drag_action_factory';
import { DragActionType } from '../../../../src/background/services/drag_action/drag_action_type';
import { SearchGoogleDragAction } from '../../../../src/background/services/drag_action/search_google_drag_action';
import { SearchBingDragAction } from '../../../../src/background/services/drag_action/search_bing_drag_action';
import { OpenAsUrlDragAction } from '../../../../src/background/services/drag_action/open_as_url_drag_action';
import { CopyTextDragAction } from '../../../../src/background/services/drag_action/copy_text_drag_action';
import { OpenInBackgroundTabDragAction } from '../../../../src/background/services/drag_action/open_in_background_tab_drag_action';
import { OpenInForegroundTabDragAction } from '../../../../src/background/services/drag_action/open_in_foreground_tab_drag_action';
import { DownloadLinkDragAction } from '../../../../src/background/services/drag_action/download_link_drag_action';
import { CopyLinkUrlDragAction } from '../../../../src/background/services/drag_action/copy_link_url_drag_action';
import { OpenImageInNewTabDragAction } from '../../../../src/background/services/drag_action/open_image_in_new_tab_drag_action';
import { DownloadImageDragAction } from '../../../../src/background/services/drag_action/download_image_drag_action';
import { ITabOperator } from '../../../../src/common/provider/tab_operator';
import { IClipboardService } from '../../../../src/background/services/clipboard/clipboard_service_interface';
import { IDownloadService } from '../../../../src/background/services/download_service_interface';
import { SearchImageGoogleDragAction } from '../../../../src/background/services/drag_action/search_image_google_drag_action';
import { CopyImageUrlDragAction } from '../../../../src/background/services/drag_action/copy_image_url_drag_action';

describe('DragActionFactory', () => {
    let container: Container;
    beforeEach(() => {
        container = new Container();
        // 依存インターフェースのモック
        const tabOperatorMock: ITabOperator = {
            createTab: jest.fn(),
            updateCurrentTab: jest.fn(),
        };
        const clipboardServiceMock: IClipboardService = {
            writeText: jest.fn(),
        };
        const downloadServiceMock: IDownloadService = {
            download: jest.fn(),
        };
        // 各クラスのバインド
        container.bind(SearchGoogleDragAction).toSelf();
        container.bind(SearchBingDragAction).toSelf();
        container.bind(OpenAsUrlDragAction).toDynamicValue(() => new OpenAsUrlDragAction(tabOperatorMock));
        container.bind(CopyTextDragAction).toDynamicValue(() => new CopyTextDragAction(clipboardServiceMock));
        container.bind(OpenInBackgroundTabDragAction).toDynamicValue(() => new OpenInBackgroundTabDragAction(tabOperatorMock));
        container.bind(OpenInForegroundTabDragAction).toDynamicValue(() => new OpenInForegroundTabDragAction(tabOperatorMock));
        container.bind(DownloadLinkDragAction).toDynamicValue(() => new DownloadLinkDragAction(downloadServiceMock));
        container.bind(CopyLinkUrlDragAction).toSelf();
        container.bind(OpenImageInNewTabDragAction).toDynamicValue(() => new OpenImageInNewTabDragAction(tabOperatorMock));
        container.bind(DownloadImageDragAction).toDynamicValue(() => new DownloadImageDragAction(downloadServiceMock));
        container.bind(SearchImageGoogleDragAction).toDynamicValue(() => new SearchImageGoogleDragAction(tabOperatorMock));
        container.bind(CopyImageUrlDragAction).toDynamicValue(() => new CopyImageUrlDragAction(clipboardServiceMock));
    });

    it('SEARCH_GOOGLEでSearchGoogleDragActionを返す', () => {
        const action = DragActionFactory.create(DragActionType.SEARCH_GOOGLE, container);
        expect(action).toBeInstanceOf(SearchGoogleDragAction);
    });
    it('SEARCH_BINGでSearchBingDragActionを返す', () => {
        const action = DragActionFactory.create(DragActionType.SEARCH_BING, container);
        expect(action).toBeInstanceOf(SearchBingDragAction);
    });
    it('OPEN_AS_URLでOpenAsUrlDragActionを返す', () => {
        const action = DragActionFactory.create(DragActionType.OPEN_AS_URL, container);
        expect(action).toBeInstanceOf(OpenAsUrlDragAction);
    });
    it('COPY_TEXTでCopyTextDragActionを返す', () => {
        const action = DragActionFactory.create(DragActionType.COPY_TEXT, container);
        expect(action).toBeInstanceOf(CopyTextDragAction);
    });
    it('OPEN_IN_BACKGROUND_TABでOpenInBackgroundTabDragActionを返す', () => {
        const action = DragActionFactory.create(DragActionType.OPEN_IN_BACKGROUND_TAB, container);
        expect(action).toBeInstanceOf(OpenInBackgroundTabDragAction);
    });
    it('OPEN_IN_FOREGROUND_TABでOpenInForegroundTabDragActionを返す', () => {
        const action = DragActionFactory.create(DragActionType.OPEN_IN_FOREGROUND_TAB, container);
        expect(action).toBeInstanceOf(OpenInForegroundTabDragAction);
    });
    it('DOWNLOAD_LINKでDownloadLinkDragActionを返す', () => {
        const action = DragActionFactory.create(DragActionType.DOWNLOAD_LINK, container);
        expect(action).toBeInstanceOf(DownloadLinkDragAction);
    });
    it('COPY_LINK_URLでCopyLinkUrlDragActionを返す', () => {
        const action = DragActionFactory.create(DragActionType.COPY_LINK_URL, container);
        expect(action).toBeInstanceOf(CopyLinkUrlDragAction);
    });
    it('OPEN_IMAGE_IN_NEW_TABでOpenImageInNewTabDragActionを返す', () => {
        const action = DragActionFactory.create(DragActionType.OPEN_IMAGE_IN_NEW_TAB, container);
        expect(action).toBeInstanceOf(OpenImageInNewTabDragAction);
    });
    it('DOWNLOAD_IMAGEでDownloadImageDragActionを返す', () => {
        const action = DragActionFactory.create(DragActionType.DOWNLOAD_IMAGE, container);
        expect(action).toBeInstanceOf(DownloadImageDragAction);
    });
    it('SEARCH_IMAGE_GOOGLEでSearchImageGoogleDragActionを返す', () => {
        const action = DragActionFactory.create(DragActionType.SEARCH_IMAGE_GOOGLE, container);
        expect(action).toBeInstanceOf(SearchImageGoogleDragAction);
    });
    it('COPY_IMAGE_URLでCopyImageUrlDragActionを返す', () => {
        const action = DragActionFactory.create(DragActionType.COPY_IMAGE_URL, container);
        expect(action).toBeInstanceOf(CopyImageUrlDragAction);
    });
    it('未対応のDragActionTypeの場合は例外を投げる', () => {
        expect(() => {
            DragActionFactory.create('notSupportedType', container);
        }).toThrow('未対応のDragActionType: notSupportedType');
    });
}); 