import 'reflect-metadata';
import { Container } from 'inversify';
import { DragActionFactory } from '../../../../src/background/services/drag_action/drag_action_factory';
import { DragActionType } from '../../../../src/background/services/drag_action/drag_action_type';
import { SearchGoogleDragAction } from '../../../../src/background/services/drag_action/search_google_drag_action';
import { SearchBingDragAction } from '../../../../src/background/services/drag_action/search_bing_drag_action';
import { OpenAsUrlDragAction } from '../../../../src/background/services/drag_action/open_as_url_drag_action';
import { OpenInBackgroundTabDragAction } from '../../../../src/background/services/drag_action/open_in_background_tab_drag_action';
import { OpenInForegroundTabDragAction } from '../../../../src/background/services/drag_action/open_in_foreground_tab_drag_action';
import { OpenImageInNewTabDragAction } from '../../../../src/background/services/drag_action/open_image_in_new_tab_drag_action';
import { ITabOperator } from '../../../../src/common/provider/tab_operator';
import { IDownloadService } from '../../../../src/background/services/download_service_interface';
import { SearchImageGoogleDragAction } from '../../../../src/background/services/drag_action/search_image_google_drag_action';

describe('DragActionFactory', () => {
    let container: Container;
    beforeEach(() => {
        container = new Container();
        // 依存インターフェースのモック
        const tabOperatorMock: ITabOperator = {
            createTab: jest.fn(),
            updateCurrentTab: jest.fn(),
            switchToNextTab: jest.fn(),
            switchToPrevTab: jest.fn(),
            togglePinActiveTab: jest.fn(),
            toggleMuteActiveTab: jest.fn(),
            closeActiveTab: jest.fn(),
            duplicateActiveTab: jest.fn(),
            reopenClosedTab: jest.fn(),
            activateLeftAndCloseActiveTab: jest.fn(),
            activateRightAndCloseActiveTab: jest.fn(),
        };
        const downloadServiceMock: IDownloadService = {
            download: jest.fn(),
        };
        // 各クラスのバインド
        container.bind(SearchGoogleDragAction).toSelf();
        container.bind(SearchBingDragAction).toSelf();
        container.bind(OpenAsUrlDragAction).toDynamicValue(() => new OpenAsUrlDragAction(tabOperatorMock));
        container.bind(OpenInBackgroundTabDragAction).toDynamicValue(() => new OpenInBackgroundTabDragAction(tabOperatorMock));
        container.bind(OpenInForegroundTabDragAction).toDynamicValue(() => new OpenInForegroundTabDragAction(tabOperatorMock));
        container.bind(OpenImageInNewTabDragAction).toDynamicValue(() => new OpenImageInNewTabDragAction(tabOperatorMock));
        container.bind(SearchImageGoogleDragAction).toDynamicValue(() => new SearchImageGoogleDragAction(tabOperatorMock));
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
    it('OPEN_IN_BACKGROUND_TABでOpenInBackgroundTabDragActionを返す', () => {
        const action = DragActionFactory.create(DragActionType.OPEN_IN_BACKGROUND_TAB, container);
        expect(action).toBeInstanceOf(OpenInBackgroundTabDragAction);
    });
    it('OPEN_IN_FOREGROUND_TABでOpenInForegroundTabDragActionを返す', () => {
        const action = DragActionFactory.create(DragActionType.OPEN_IN_FOREGROUND_TAB, container);
        expect(action).toBeInstanceOf(OpenInForegroundTabDragAction);
    });
    it('OPEN_IMAGE_IN_NEW_TABでOpenImageInNewTabDragActionを返す', () => {
        const action = DragActionFactory.create(DragActionType.OPEN_IMAGE_IN_NEW_TAB, container);
        expect(action).toBeInstanceOf(OpenImageInNewTabDragAction);
    });

    it('SEARCH_IMAGE_GOOGLEでSearchImageGoogleDragActionを返す', () => {
        const action = DragActionFactory.create(DragActionType.SEARCH_IMAGE_GOOGLE, container);
        expect(action).toBeInstanceOf(SearchImageGoogleDragAction);
    });
    it('未対応のDragActionTypeの場合は例外を投げる', () => {
        expect(() => {
            DragActionFactory.create('notSupportedType', container);
        }).toThrow('未対応のDragActionType: notSupportedType');
    });
}); 