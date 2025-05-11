import { ChromeTabOperator } from '../../../src/common/provider/chrome_tab_operator';

describe('ChromeTabOperator', () => {
    let operator: ChromeTabOperator;
    let chromeMock: any;
    let originalTabs: any;
    let originalRuntime: any;

    beforeEach(() => {
        operator = new ChromeTabOperator();
        originalTabs = global.chrome?.tabs;
        originalRuntime = global.chrome?.runtime;
        chromeMock = global.chrome = {
            tabs: {
                create: jest.fn(),
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
        global.chrome.tabs = originalTabs;
        global.chrome.runtime = originalRuntime;
        jest.resetAllMocks();
    });

    describe('createTab', () => {
        it('正常にタブを作成できる', async () => {
            chromeMock.tabs.create.mockImplementation((opts: any, cb: any) => {
                cb({ id: 123 });
            });
            const result = await operator.createTab('https://example.com', true);
            expect(result).toEqual({ id: 123 });
            expect(chromeMock.tabs.create).toHaveBeenCalledWith({ url: 'https://example.com', active: true }, expect.any(Function));
        });

        it('chrome.runtime.lastErrorがある場合は例外', async () => {
            chromeMock.tabs.create.mockImplementation((opts: any, cb: any) => {
                chromeMock.runtime.lastError = { message: 'エラー発生' };
                cb(undefined);
            });
            await expect(operator.createTab('https://example.com', true)).rejects.toThrow('エラー発生');
            chromeMock.runtime.lastError = undefined;
        });
    });

    describe('updateCurrentTab', () => {
        it('正常にアクティブタブのURLを更新できる', async () => {
            chromeMock.tabs.query.mockImplementation((opts: any, cb: any) => {
                cb([{ id: 456 }]);
            });
            chromeMock.tabs.update.mockImplementation((tabId: any, opts: any, cb: any) => {
                cb();
            });
            await expect(operator.updateCurrentTab('https://example.com')).resolves.toBeUndefined();
            expect(chromeMock.tabs.query).toHaveBeenCalledWith({ active: true, currentWindow: true }, expect.any(Function));
            expect(chromeMock.tabs.update).toHaveBeenCalledWith(456, { url: 'https://example.com' }, expect.any(Function));
        });

        it('chrome.runtime.lastErrorがqueryで発生した場合は例外', async () => {
            chromeMock.tabs.query.mockImplementation((opts: any, cb: any) => {
                chromeMock.runtime.lastError = { message: 'queryエラー' };
                cb([]);
            });
            await expect(operator.updateCurrentTab('https://example.com')).rejects.toThrow('queryエラー');
            chromeMock.runtime.lastError = undefined;
        });

        it('アクティブタブが見つからない場合はLogger出力のみ', async () => {
            chromeMock.tabs.query.mockImplementation((opts: any, cb: any) => {
                cb([]);
            });
            const loggerSpy = jest.spyOn(require('../../../../src/common/logger/logger').default, 'debug');
            await operator.updateCurrentTab('https://example.com');
            expect(loggerSpy).toHaveBeenCalledWith('アクティブなタブが見つかりません');
            loggerSpy.mockRestore();
        });

        it('chrome.runtime.lastErrorがupdateで発生した場合は例外', async () => {
            chromeMock.tabs.query.mockImplementation((opts: any, cb: any) => {
                cb([{ id: 789 }]);
            });
            chromeMock.tabs.update.mockImplementation((tabId: any, opts: any, cb: any) => {
                chromeMock.runtime.lastError = { message: 'updateエラー' };
                cb();
            });
            await expect(operator.updateCurrentTab('https://example.com')).rejects.toThrow('updateエラー');
            chromeMock.runtime.lastError = undefined;
        });
    });

    describe('switchToNextTab', () => {
        it('正常に次のタブに切り替えられる', async () => {
            // タブ: [1, 2, 3]、アクティブ: 2 → 3へ
            chromeMock.tabs.query
                .mockImplementationOnce((q: any, cb: any) => cb([{ id: 1 }, { id: 2 }, { id: 3 }]))
                .mockImplementationOnce((q: any, cb: any) => cb([{ id: 2 }]));
            chromeMock.tabs.update.mockImplementation((id: any, opts: any, cb: any) => cb && cb());
            await expect(operator.switchToNextTab()).resolves.toBeUndefined();
            expect(chromeMock.tabs.update).toHaveBeenCalledWith(3, { active: true }, expect.any(Function));
        });
        it('アクティブタブが見つからない場合はLogger出力のみ', async () => {
            chromeMock.tabs.query
                .mockImplementationOnce((q: any, cb: any) => cb([{ id: 1 }, { id: 2 }]))
                .mockImplementationOnce((q: any, cb: any) => cb([]));
            // Logger.debugが呼ばれることを確認
            const loggerSpy = jest.spyOn(require('../../../../src/common/logger/logger').default, 'debug');
            await operator.switchToNextTab();
            expect(loggerSpy).toHaveBeenCalledWith('アクティブなタブが見つかりません');
            loggerSpy.mockRestore();
        });
        it('chrome.runtime.lastErrorが発生した場合はreject', async () => {
            chromeMock.tabs.query.mockImplementationOnce((q: any, cb: any) => {
                chromeMock.runtime.lastError = { message: 'queryエラー' };
                cb([]);
            });
            await expect(operator.switchToNextTab()).rejects.toThrow('queryエラー');
            chromeMock.runtime.lastError = undefined;
        });
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

    describe('toggleMuteActiveTab', () => {
        it('ミュートされていないタブをミュートする', async () => {
            chromeMock.tabs.query.mockImplementation((q: any, cb: any) => cb([{ id: 1, mutedInfo: { muted: false } }]));
            chromeMock.tabs.update.mockImplementation((id: any, opts: any, cb: any) => cb && cb());
            await expect(operator.toggleMuteActiveTab()).resolves.toBeUndefined();
            expect(chromeMock.tabs.update).toHaveBeenCalledWith(1, { muted: true }, expect.any(Function));
        });

        it('ミュートされているタブをミュート解除する', async () => {
            chromeMock.tabs.query.mockImplementation((q: any, cb: any) => cb([{ id: 1, mutedInfo: { muted: true } }]));
            chromeMock.tabs.update.mockImplementation((id: any, opts: any, cb: any) => cb && cb());
            await expect(operator.toggleMuteActiveTab()).resolves.toBeUndefined();
            expect(chromeMock.tabs.update).toHaveBeenCalledWith(1, { muted: false }, expect.any(Function));
        });
    });

    it('closeActiveTab: アクティブタブを閉じる', async () => {
        chromeMock.tabs.query.mockImplementation((q: any, cb: any) => cb([{ id: 1 }]));
        chromeMock.tabs.remove.mockImplementation((id: any, cb: any) => cb && cb());
        await expect(operator.closeActiveTab()).resolves.toBeUndefined();
        expect(chromeMock.tabs.remove).toHaveBeenCalledWith(1, expect.any(Function));
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

    it('activateLeftAndCloseActiveTab: アクティブタブを閉じて左隣のタブをアクティブにする', async () => {
        // タブ: [1, 2, 3]、アクティブ: 2
        chromeMock.tabs.query
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 1 }, { id: 2 }, { id: 3 }]))
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 2 }]));
        chromeMock.tabs.remove.mockImplementation((id: any, cb: any) => cb && cb());
        chromeMock.tabs.update.mockImplementation((id: any, opts: any, cb: any) => cb && cb());
        await expect(operator.activateLeftAndCloseActiveTab()).resolves.toBeUndefined();
        // 2を閉じて1をアクティブ化
        expect(chromeMock.tabs.remove).toHaveBeenCalledWith(2, expect.any(Function));
        expect(chromeMock.tabs.update).toHaveBeenCalledWith(1, { active: true }, expect.any(Function));
    });

    it('activateRightAndCloseActiveTab: アクティブタブを閉じて右隣のタブをアクティブにする', async () => {
        // タブ: [1, 2, 3]、アクティブ: 2
        chromeMock.tabs.query
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 1 }, { id: 2 }, { id: 3 }]))
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 2 }]));
        chromeMock.tabs.remove.mockImplementation((id: any, cb: any) => cb && cb());
        chromeMock.tabs.update.mockImplementation((id: any, opts: any, cb: any) => cb && cb());
        await expect(operator.activateRightAndCloseActiveTab()).resolves.toBeUndefined();
        // 2を閉じて3をアクティブ化
        expect(chromeMock.tabs.remove).toHaveBeenCalledWith(2, expect.any(Function));
        expect(chromeMock.tabs.update).toHaveBeenCalledWith(3, { active: true }, expect.any(Function));
    });

    it('activateLeftAndCloseActiveTab: アクティブタブがウィンドウ内で見つからない場合はLogger出力のみ', async () => {
        chromeMock.tabs.query
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 1 }, { id: 2 }, { id: 3 }]))
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 999 }])); // 存在しないID
        const loggerSpy = jest.spyOn(require('../../../../src/common/logger/logger').default, 'debug');
        await operator.activateLeftAndCloseActiveTab();
        expect(loggerSpy).toHaveBeenCalledWith('アクティブなタブがウィンドウ内で見つかりません');
        loggerSpy.mockRestore();
    });

    it('activateLeftAndCloseActiveTab: 左端タブを閉じた場合はupdateが呼ばれない', async () => {
        chromeMock.tabs.query
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 1 }, { id: 2 }, { id: 3 }]))
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 1 }])); // アクティブ: 左端
        chromeMock.tabs.remove.mockImplementation((id: any, cb: any) => cb && cb());
        chromeMock.tabs.update.mockImplementation((id: any, opts: any, cb: any) => cb && cb());
        await expect(operator.activateLeftAndCloseActiveTab()).resolves.toBeUndefined();
        expect(chromeMock.tabs.remove).toHaveBeenCalledWith(1, expect.any(Function));
        expect(chromeMock.tabs.update).not.toHaveBeenCalled();
    });

    it('activateRightAndCloseActiveTab: アクティブタブがウィンドウ内で見つからない場合はLogger出力のみ', async () => {
        chromeMock.tabs.query
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 1 }, { id: 2 }, { id: 3 }]))
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 999 }])); // 存在しないID
        const loggerSpy = jest.spyOn(require('../../../../src/common/logger/logger').default, 'debug');
        await operator.activateRightAndCloseActiveTab();
        expect(loggerSpy).toHaveBeenCalledWith('アクティブなタブがウィンドウ内で見つかりません');
        loggerSpy.mockRestore();
    });

    it('activateRightAndCloseActiveTab: 右端タブを閉じた場合はupdateが呼ばれない', async () => {
        chromeMock.tabs.query
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 1 }, { id: 2 }, { id: 3 }]))
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 3 }])); // アクティブ: 右端
        chromeMock.tabs.remove.mockImplementation((id: any, cb: any) => cb && cb());
        chromeMock.tabs.update.mockImplementation((id: any, opts: any, cb: any) => cb && cb());
        await expect(operator.activateRightAndCloseActiveTab()).resolves.toBeUndefined();
        expect(chromeMock.tabs.remove).toHaveBeenCalledWith(3, expect.any(Function));
        expect(chromeMock.tabs.update).not.toHaveBeenCalled();
    });

    it('switchToNextTab: タブが1つしかない場合はLogger出力のみ', async () => {
        chromeMock.tabs.query
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 1 }]))
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 1 }]));
        const loggerSpy = jest.spyOn(require('../../../../src/common/logger/logger').default, 'debug');
        await operator.switchToNextTab();
        expect(loggerSpy).toHaveBeenCalledWith('タブが1つしかありません');
        loggerSpy.mockRestore();
    });

    it('switchToNextTab: 次のタブが見つからない場合はLogger出力のみ', async () => {
        // タブ: [1, 2]、アクティブ: 2、nextIndex=0、tabs[0]={}（idなし）
        chromeMock.tabs.query
            .mockImplementationOnce((q: any, cb: any) => cb([{}, { id: 2 }]))
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 2 }]));
        const loggerSpy = jest.spyOn(require('../../../../src/common/logger/logger').default, 'debug');
        await operator.switchToNextTab();
        expect(loggerSpy).toHaveBeenCalledWith('次のタブが見つかりません');
        loggerSpy.mockRestore();
    });

    it('switchToPrevTab: 前のタブが見つからない場合はLogger出力のみ', async () => {
        // タブ: [1, {}]、アクティブ: 1、prevIndex=1、tabs[1]={}（idなし）
        chromeMock.tabs.query
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 1 }, {}]))
            .mockImplementationOnce((q: any, cb: any) => cb([{ id: 1 }]));
        const loggerSpy = jest.spyOn(require('../../../../src/common/logger/logger').default, 'debug');
        await operator.switchToPrevTab();
        expect(loggerSpy).toHaveBeenCalledWith('前のタブが見つかりません');
        loggerSpy.mockRestore();
    });
}); 