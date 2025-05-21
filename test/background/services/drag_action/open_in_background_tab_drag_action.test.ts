import { OpenInBackgroundTabDragAction } from '../../../../src/background/services/drag_action/open_in_background_tab_drag_action';
import Logger from '../../../../src/common/logger/logger';

describe('OpenInBackgroundTabDragAction', () => {
    const createMock = jest.fn();
    const updateMock = jest.fn();
    const tabOperatorMock = {
        createTab: createMock,
        updateCurrentTab: updateMock,
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
    const originalTabs = global.chrome?.tabs;
    const originalRuntime = global.chrome?.runtime;
    beforeAll(() => {
        global.chrome = {
            tabs: { create: createMock },
            runtime: { lastError: undefined },
        } as any;
    });
    afterAll(() => {
        if (originalTabs) global.chrome.tabs = originalTabs;
        if (originalRuntime) global.chrome.runtime = originalRuntime;
    });
    beforeEach(() => {
        jest.clearAllMocks();
        global.chrome.runtime.lastError = undefined;
    });
    jest.spyOn(Logger, 'info').mockImplementation(jest.fn());
    jest.spyOn(Logger, 'warn').mockImplementation(jest.fn());
    jest.spyOn(Logger, 'error').mockImplementation(jest.fn());
    jest.spyOn(Logger, 'debug').mockImplementation(jest.fn());

    it('url指定時はtabOperator.createTabがactive: falseで呼ばれる', async () => {
        createMock.mockResolvedValue({ id: 123 });
        const action = new OpenInBackgroundTabDragAction(tabOperatorMock);
        const payload = {
            type: 'link' as const,
            direction: 'up' as const,
            actionName: 'openInBackgroundTab' as const,
            params: {},
            selectedValue: 'https://example.com',
        };
        await action.execute(payload);
        expect(createMock).toHaveBeenCalledWith('https://example.com', false);
        expect(Logger.debug).toHaveBeenCalledWith('バックグラウンドタブでリンクを開きました', { tabId: 123, url: 'https://example.com' });
    });

    it('typeがlink以外はwarnログのみ', async () => {
        const action = new OpenInBackgroundTabDragAction(tabOperatorMock);
        const payload = {
            type: 'text' as const,
            direction: 'up' as const,
            actionName: 'openInBackgroundTab' as const,
            params: {},
            selectedValue: 'https://example.com',
        };
        await action.execute(payload);
        expect(Logger.warn).toHaveBeenCalledWith('リンクタイプ以外は未対応です', { payload });
        expect(createMock).not.toHaveBeenCalled();
    });

    it('url未指定時はwarnログのみ', async () => {
        const action = new OpenInBackgroundTabDragAction(tabOperatorMock);
        const payload = {
            type: 'link' as const,
            direction: 'up' as const,
            actionName: 'openInBackgroundTab' as const,
            params: {},
            selectedValue: '',
        };
        await action.execute(payload);
        expect(Logger.warn).toHaveBeenCalledWith('開くリンクURLが指定されていません', { payload });
        expect(createMock).not.toHaveBeenCalled();
    });

    it('tabOperator.createTabがrejectした場合はerrorログ', async () => {
        createMock.mockRejectedValue(new Error('error!'));
        const action = new OpenInBackgroundTabDragAction(tabOperatorMock);
        const payload = {
            type: 'link' as const,
            direction: 'up' as const,
            actionName: 'openInBackgroundTab' as const,
            params: {},
            selectedValue: 'https://example.com',
        };
        await action.execute(payload);
        expect(Logger.error).toHaveBeenCalledWith('バックグラウンドタブでのリンクオープンに失敗', { error: 'error!', url: 'https://example.com' });
    });
}); 