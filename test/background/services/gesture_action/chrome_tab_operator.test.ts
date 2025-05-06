import { ChromeTabOperator } from '../../../../src/common/provider/chrome_tab_operator';

describe('ChromeTabOperator', () => {
    let operator: ChromeTabOperator;
    let chromeMock: any;

    beforeEach(() => {
        operator = new ChromeTabOperator();
        chromeMock = global.chrome = {
            tabs: {
                query: jest.fn(),
                update: jest.fn(),
                remove: jest.fn(),
                duplicate: jest.fn(),
            },
            sessions: {
                restore: jest.fn(),
            },
            runtime: {
                lastError: undefined,
            },
        } as any;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('switchToPrevTab: 前のタブに切り替え', async () => {
        chromeMock.tabs.query
            .mockImplementationOnce((q: any, cb: any) => cb([
                { id: 1 }, { id: 2 }, { id: 3 }
            ]))
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 2 }]));
        chromeMock.tabs.update.mockImplementation((id: any, opts: any, cb: any) => cb && cb());
        await expect(operator.switchToPrevTab()).resolves.toBeUndefined();
        expect(chromeMock.tabs.update).toHaveBeenCalledWith(1, { active: true }, expect.any(Function));
    });

    it('togglePinActiveTab: ピン留め切り替え', async () => {
        chromeMock.tabs.query.mockImplementation((q: any, cb: any) => cb([{ id: 1, pinned: false }]));
        chromeMock.tabs.update.mockImplementation((id: any, opts: any, cb: any) => cb && cb());
        await expect(operator.togglePinActiveTab()).resolves.toBeUndefined();
        expect(chromeMock.tabs.update).toHaveBeenCalledWith(1, { pinned: true }, expect.any(Function));
    });

    it('toggleMuteActiveTab: ミュート切り替え', async () => {
        chromeMock.tabs.query.mockImplementation((q: any, cb: any) => cb([{ id: 1, mutedInfo: { muted: false } }]));
        chromeMock.tabs.update.mockImplementation((id: any, opts: any, cb: any) => cb && cb());
        await expect(operator.toggleMuteActiveTab()).resolves.toBeUndefined();
        expect(chromeMock.tabs.update).toHaveBeenCalledWith(1, { muted: true }, expect.any(Function));
    });

    it('closeActiveTab: アクティブタブを閉じる', async () => {
        chromeMock.tabs.query.mockImplementation((q: any, cb: any) => cb([{ id: 1 }]));
        chromeMock.tabs.remove.mockImplementation((id: any, cb: any) => cb && cb());
        await expect(operator.closeActiveTab()).resolves.toBeUndefined();
        expect(chromeMock.tabs.remove).toHaveBeenCalledWith(1, expect.any(Function));
    });

    it('closeTabsToRight: 右側のタブを閉じる', async () => {
        chromeMock.tabs.query
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 1 }, { id: 2 }, { id: 3 }]))
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 2 }]));
        chromeMock.tabs.remove.mockImplementation((ids: any, cb: any) => cb && cb());
        await expect(operator.closeTabsToRight()).resolves.toBeUndefined();
        expect(chromeMock.tabs.remove).toHaveBeenCalledWith([3], expect.any(Function));
    });

    it('closeTabsToLeft: 左側のタブを閉じる', async () => {
        chromeMock.tabs.query
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 1 }, { id: 2 }, { id: 3 }]))
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 2 }]));
        chromeMock.tabs.remove.mockImplementation((ids: any, cb: any) => cb && cb());
        await expect(operator.closeTabsToLeft()).resolves.toBeUndefined();
        expect(chromeMock.tabs.remove).toHaveBeenCalledWith([1], expect.any(Function));
    });

    it('duplicateActiveTab: アクティブタブを複製', async () => {
        chromeMock.tabs.query.mockImplementation((q: any, cb: any) => cb([{ id: 1 }]));
        chromeMock.tabs.duplicate.mockImplementation((id: any, cb: any) => cb && cb());
        await expect(operator.duplicateActiveTab()).resolves.toBeUndefined();
        expect(chromeMock.tabs.duplicate).toHaveBeenCalledWith(1, expect.any(Function));
    });

    it('reopenClosedTab: chrome.sessions.restoreが呼ばれる', async () => {
        chromeMock.sessions.restore.mockImplementation((cb: any) => cb && cb());
        await expect(operator.reopenClosedTab()).resolves.toBeUndefined();
        expect(chromeMock.sessions.restore).toHaveBeenCalled();
    });

    it('chrome.tabs.queryでエラー時はreject', async () => {
        chromeMock.runtime.lastError = { message: 'fail' };
        chromeMock.tabs.query.mockImplementation((q: any, cb: any) => cb([]));
        await expect(operator.togglePinActiveTab()).rejects.toThrow('fail');
        chromeMock.runtime.lastError = undefined;
    });

    it('chrome.sessions.restoreが未定義ならreject', async () => {
        chromeMock.sessions.restore = undefined;
        await expect(operator.reopenClosedTab()).rejects.toThrow('chrome.sessions APIが利用できません');
    });
}); 