import { OpenAsUrlDragAction } from '../../../../src/background/services/drag_action/open_as_url_drag_action';
import Logger from '../../../../src/common/logger/logger';
import { DragActionMessagePayload } from '../../../../src/content/services/message/message_types';

describe('OpenAsUrlDragAction', () => {
    let loggerInfoSpy: jest.SpyInstance;
    let loggerWarnSpy: jest.SpyInstance;
    let loggerErrorSpy: jest.SpyInstance;
    let tabsCreateMock: jest.Mock;
    let tabsUpdateMock: jest.Mock;
    let tabsQueryMock: jest.Mock;
    let tabOperatorMock: any;
    const originalChrome = global.chrome;

    beforeEach(() => {
        loggerInfoSpy = jest.spyOn(Logger, 'info').mockImplementation(() => {});
        loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});
        loggerErrorSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {});
        tabsCreateMock = jest.fn();
        tabsUpdateMock = jest.fn();
        tabsQueryMock = jest.fn();
        tabOperatorMock = {
            createTab: tabsCreateMock,
            updateCurrentTab: tabsUpdateMock,
        };
        // @ts-ignore
        global.chrome = {
            tabs: {
                create: tabsCreateMock,
                update: tabsUpdateMock,
                query: tabsQueryMock,
            },
        } as any;
    });

    afterEach(() => {
        jest.restoreAllMocks();
        global.chrome = originalChrome;
    });

    it('textが指定されていない場合はwarnログのみ', async () => {
        const action = new OpenAsUrlDragAction(tabOperatorMock);
        const payload: DragActionMessagePayload = {
            type: 'text',
            direction: 'up',
            actionName: 'openAsUrl',
            params: {},
            selectedValue: '',
        };
        await action.execute(payload);
        expect(loggerWarnSpy).toHaveBeenCalledWith('URLとして開くテキストが指定されていません', { payload });
        expect(tabsCreateMock).not.toHaveBeenCalled();
        expect(tabsUpdateMock).not.toHaveBeenCalled();
    });

    it('http/httpsで始まる場合はそのまま新規タブで開く', async () => {
        const action = new OpenAsUrlDragAction(tabOperatorMock);
        const payload: DragActionMessagePayload = {
            type: 'text',
            direction: 'up',
            actionName: 'openAsUrl',
            params: { newTab: true },
            selectedValue: 'https://example.com',
        };
        await action.execute(payload);
        expect(tabsCreateMock).toHaveBeenCalledWith('https://example.com', true);
    });

    it('http/httpsで始まらない場合はhttp://を付与して新規タブで開く', async () => {
        const action = new OpenAsUrlDragAction(tabOperatorMock);
        const payload: DragActionMessagePayload = {
            type: 'text',
            direction: 'up',
            actionName: 'openAsUrl',
            params: { newTab: true },
            selectedValue: 'example.com',
        };
        await action.execute(payload);
        expect(tabsCreateMock).toHaveBeenCalledWith('http://example.com', true);
    });

    it('newTab=falseの場合は現在のタブで遷移', async () => {
        tabsQueryMock.mockImplementation((_query, cb) => cb([{ id: 123 }]));
        const action = new OpenAsUrlDragAction(tabOperatorMock);
        const payload: DragActionMessagePayload = {
            type: 'text',
            direction: 'up',
            actionName: 'openAsUrl',
            params: { newTab: false },
            selectedValue: 'example.com',
        };
        await action.execute(payload);
        expect(tabsUpdateMock).toHaveBeenCalledWith('http://example.com');
    });

    it('newTab未指定時はデフォルトで新規タブで開く', async () => {
        const action = new OpenAsUrlDragAction(tabOperatorMock);
        const payload: DragActionMessagePayload = {
            type: 'text',
            direction: 'up',
            actionName: 'openAsUrl',
            params: {},
            selectedValue: 'example.com',
        };
        await action.execute(payload);
        expect(tabsCreateMock).toHaveBeenCalledWith('http://example.com', true);
    });
}); 