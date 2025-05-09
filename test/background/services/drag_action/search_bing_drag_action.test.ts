import { SearchBingDragAction } from '../../../../src/background/services/drag_action/search_bing_drag_action';
import Logger from '../../../../src/common/logger/logger';

describe('SearchBingDragAction', () => {
    let loggerDebugSpy: jest.SpyInstance;
    let loggerWarnSpy: jest.SpyInstance;
    const createTabMock = jest.fn();
    const originalTabs = global.chrome?.tabs;

    beforeAll(() => {
        global.chrome = {
            tabs: { create: createTabMock },
        } as any;
    });
    afterAll(() => {
        if (originalTabs) global.chrome.tabs = originalTabs;
    });
    beforeEach(() => {
        jest.clearAllMocks();
        loggerDebugSpy = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});
    });

    it('text指定時はchrome.tabs.createがBing検索URLで呼ばれる', async () => {
        const action = new SearchBingDragAction();
        const payload = {
            type: 'text' as const,
            direction: 'up' as const,
            actionName: 'searchBing' as const,
            params: { text: 'テスト' },
            selectedValue: 'テスト',
        };
        await action.execute(payload);
        expect(createTabMock).toHaveBeenCalledWith({ url: 'https://www.bing.com/search?q=%E3%83%86%E3%82%B9%E3%83%88' });
        expect(loggerDebugSpy).toHaveBeenCalledWith('SearchBingDragAction: execute() が呼び出されました', { payload });
    });

    it('text未指定時はchrome.tabs.createされず警告ログが出る', async () => {
        const action = new SearchBingDragAction();
        const payload = {
            type: 'text' as const,
            direction: 'up' as const,
            actionName: 'searchBing' as const,
            params: {},
            selectedValue: '',
        };
        await action.execute(payload);
        expect(createTabMock).not.toHaveBeenCalled();
        expect(loggerWarnSpy).toHaveBeenCalledWith('検索テキストが指定されていません', { payload });
    });

    it('カスタムURLテンプレートが指定された場合はそれが使われる', async () => {
        const action = new SearchBingDragAction();
        const payload = {
            type: 'text' as const,
            direction: 'up' as const,
            actionName: 'searchBing' as const,
            params: { text: 'AI', url: 'https://example.com/search?q=%s' },
            selectedValue: 'AI',
        };
        await action.execute(payload);
        expect(createTabMock).toHaveBeenCalledWith({ url: 'https://example.com/search?q=AI' });
    });
}); 