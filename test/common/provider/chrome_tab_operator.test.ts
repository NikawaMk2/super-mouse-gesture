import { ChromeTabOperator } from '../../../src/common/provider/chrome_tab_operator';

describe('ChromeTabOperator', () => {
    let originalTabs: any;
    let originalRuntime: any;
    let operator: ChromeTabOperator;

    beforeEach(() => {
        operator = new ChromeTabOperator();
        originalTabs = global.chrome?.tabs;
        originalRuntime = global.chrome?.runtime;
        global.chrome = {
            tabs: {
                create: jest.fn(),
                query: jest.fn(),
                update: jest.fn(),
            },
            runtime: {
                lastError: undefined,
            },
        } as any;
    });

    afterEach(() => {
        global.chrome.tabs = originalTabs;
        global.chrome.runtime = originalRuntime;
    });

    describe('createTab', () => {
        it('正常にタブを作成できる', async () => {
            (global.chrome.tabs.create as jest.Mock).mockImplementation((opts, cb) => {
                cb({ id: 123 });
            });
            const result = await operator.createTab('https://example.com', true);
            expect(result).toEqual({ id: 123 });
            expect(global.chrome.tabs.create).toHaveBeenCalledWith({ url: 'https://example.com', active: true }, expect.any(Function));
        });

        it('chrome.runtime.lastErrorがある場合は例外', async () => {
            (global.chrome.tabs.create as jest.Mock).mockImplementation((opts, cb) => {
                global.chrome.runtime.lastError = { message: 'エラー発生' };
                cb(undefined);
            });
            await expect(operator.createTab('https://example.com', true)).rejects.toThrow('エラー発生');
            global.chrome.runtime.lastError = undefined;
        });
    });

    describe('updateCurrentTab', () => {
        it('正常にアクティブタブのURLを更新できる', async () => {
            (global.chrome.tabs.query as jest.Mock).mockImplementation((opts, cb) => {
                cb([{ id: 456 }]);
            });
            (global.chrome.tabs.update as jest.Mock).mockImplementation((tabId, opts, cb) => {
                cb();
            });
            await expect(operator.updateCurrentTab('https://example.com')).resolves.toBeUndefined();
            expect(global.chrome.tabs.query).toHaveBeenCalledWith({ active: true, currentWindow: true }, expect.any(Function));
            expect(global.chrome.tabs.update).toHaveBeenCalledWith(456, { url: 'https://example.com' }, expect.any(Function));
        });

        it('chrome.runtime.lastErrorがqueryで発生した場合は例外', async () => {
            (global.chrome.tabs.query as jest.Mock).mockImplementation((opts, cb) => {
                global.chrome.runtime.lastError = { message: 'queryエラー' };
                cb([]);
            });
            await expect(operator.updateCurrentTab('https://example.com')).rejects.toThrow('queryエラー');
            global.chrome.runtime.lastError = undefined;
        });

        it('アクティブタブが見つからない場合は例外', async () => {
            (global.chrome.tabs.query as jest.Mock).mockImplementation((opts, cb) => {
                cb([]);
            });
            await expect(operator.updateCurrentTab('https://example.com')).rejects.toThrow('アクティブなタブが見つかりません');
        });

        it('chrome.runtime.lastErrorがupdateで発生した場合は例外', async () => {
            (global.chrome.tabs.query as jest.Mock).mockImplementation((opts, cb) => {
                cb([{ id: 789 }]);
            });
            (global.chrome.tabs.update as jest.Mock).mockImplementation((tabId, opts, cb) => {
                global.chrome.runtime.lastError = { message: 'updateエラー' };
                cb();
            });
            await expect(operator.updateCurrentTab('https://example.com')).rejects.toThrow('updateエラー');
            global.chrome.runtime.lastError = undefined;
        });
    });
}); 