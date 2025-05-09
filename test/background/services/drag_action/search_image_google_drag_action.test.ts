import { SearchImageGoogleDragAction } from '../../../../src/background/services/drag_action/search_image_google_drag_action';
import Logger from '../../../../src/common/logger/logger';
import { ITabOperator } from '../../../../src/common/provider/tab_operator';

describe('SearchImageGoogleDragAction', () => {
    let loggerDebugSpy: jest.SpyInstance;
    let loggerWarnSpy: jest.SpyInstance;
    let loggerErrorSpy: jest.SpyInstance;
    let tabOperatorMock: ITabOperator;
    beforeEach(() => {
        loggerDebugSpy = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});
        loggerErrorSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {});
        tabOperatorMock = {
            createTab: jest.fn().mockResolvedValue({ id: 123 }),
            updateCurrentTab: jest.fn(),
            switchToNextTab: jest.fn(),
            switchToPrevTab: jest.fn(),
            togglePinActiveTab: jest.fn(),
            toggleMuteActiveTab: jest.fn(),
            closeActiveTab: jest.fn(),
            closeTabsToRight: jest.fn(),
            closeTabsToLeft: jest.fn(),
            duplicateActiveTab: jest.fn(),
            reopenClosedTab: jest.fn(),
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('url指定時はGoogle画像検索URLでタブが作成される', async () => {
        const action = new SearchImageGoogleDragAction(tabOperatorMock);
        const payload = {
            type: 'image' as const,
            direction: 'up' as const,
            actionName: 'searchImageGoogle' as const,
            params: {},
            selectedValue: 'https://example.com/image.png',
        };
        await action.execute(payload);
        expect(tabOperatorMock.createTab).toHaveBeenCalledWith(
            'https://www.google.com/searchbyimage?image_url=' + encodeURIComponent('https://example.com/image.png'),
            true
        );
        expect(loggerDebugSpy).toHaveBeenCalledWith('SearchImageGoogleDragAction: execute() が呼び出されました', { payload });
    });

    it('selectedValue未指定時はタブ作成されず警告ログが出る', async () => {
        const action = new SearchImageGoogleDragAction(tabOperatorMock);
        const payload = {
            type: 'image' as const,
            direction: 'up' as const,
            actionName: 'searchImageGoogle' as const,
            params: {},
            selectedValue: '',
        };
        await action.execute(payload);
        expect(tabOperatorMock.createTab).not.toHaveBeenCalled();
        expect(loggerWarnSpy).toHaveBeenCalledWith('Google画像検索する画像URLが指定されていません', { payload });
    });

    it('タブ作成失敗時はエラーログが出る', async () => {
        tabOperatorMock.createTab = jest.fn().mockRejectedValue(new Error('tab error'));
        const action = new SearchImageGoogleDragAction(tabOperatorMock);
        const payload = {
            type: 'image' as const,
            direction: 'up' as const,
            actionName: 'searchImageGoogle' as const,
            params: {},
            selectedValue: 'https://example.com/image.png',
        };
        await action.execute(payload);
        expect(loggerErrorSpy).toHaveBeenCalledWith('Google画像検索タブの作成に失敗しました', expect.objectContaining({ error: 'tab error' }));
    });
}); 