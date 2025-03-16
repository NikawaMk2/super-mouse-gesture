import 'reflect-metadata';
import { ChromeTabOperator } from '../../../src/background/services/chrome_tab_operator';

describe('ChromeTabOperatorクラスのテスト', () => {
    let chromeTabOperator: ChromeTabOperator;
    let mockTabs: chrome.tabs.Tab[];

    beforeEach(() => {
        chromeTabOperator = new ChromeTabOperator();
        mockTabs = [
            { id: 1, index: 0, title: 'Tab 1', url: 'https://example.test/1', pinned: false, highlighted: false, active: false, incognito: false, selected: false, discarded: false, autoDiscardable: true, groupId: -1, windowId: 1, frozen: false },
            { id: 2, index: 1, title: 'Tab 2', url: 'https://example.test/2', pinned: false, highlighted: false, active: true, incognito: false, selected: true, discarded: false, autoDiscardable: true, groupId: -1, windowId: 1, frozen: false },
            { id: 3, index: 2, title: 'Tab 3', url: 'https://example.test/3', pinned: false, highlighted: false, active: false, incognito: false, selected: false, discarded: false, autoDiscardable: true, groupId: -1, windowId: 1, frozen: false }
        ];

        // Chromeのタブ操作APIをモック化
        global.chrome = {
            tabs: {
                query: jest.fn(),
                update: jest.fn(),
                remove: jest.fn()
            }
        } as any;
    });

    describe('getCurrentWindowTabsメソッドのテスト', () => {
        it('現在のウィンドウのタブを取得できること', async () => {
            (chrome.tabs.query as jest.Mock).mockResolvedValue(mockTabs);
            const tabs = await chromeTabOperator.getCurrentWindowTabs();
            expect(tabs).toEqual(mockTabs);
            expect(chrome.tabs.query).toHaveBeenCalledWith({ currentWindow: true });
        });
    });

    describe('activateTabメソッドのテスト', () => {
        it('指定したタブをアクティブにできること', async () => {
            await chromeTabOperator.activateTab(2);
            expect(chrome.tabs.update).toHaveBeenCalledWith(2, { active: true });
        });
    });

    describe('removeTabメソッドのテスト', () => {
        it('指定したタブを削除できること', async () => {
            await chromeTabOperator.removeTab(2);
            expect(chrome.tabs.remove).toHaveBeenCalledWith(2);
        });
    });

    describe('activateLeftTabAndCloseCurrentTabメソッドのテスト', () => {
        it('左のタブをアクティブにして現在のタブを閉じられること', async () => {
            (chrome.tabs.query as jest.Mock).mockResolvedValue(mockTabs);
            await chromeTabOperator.activateLeftTabAndCloseCurrentTab(2);
            expect(chrome.tabs.update).toHaveBeenCalledWith(1, { active: true });
            expect(chrome.tabs.remove).toHaveBeenCalledWith(2);
        });

        it('最初のタブの場合は単に閉じるだけであること', async () => {
            (chrome.tabs.query as jest.Mock).mockResolvedValue(mockTabs);
            await chromeTabOperator.activateLeftTabAndCloseCurrentTab(1);
            expect(chrome.tabs.update).not.toHaveBeenCalled();
            expect(chrome.tabs.remove).toHaveBeenCalledWith(1);
        });
    });

    describe('activateRightTabAndCloseCurrentTabメソッドのテスト', () => {
        it('右のタブをアクティブにして現在のタブを閉じられること', async () => {
            (chrome.tabs.query as jest.Mock).mockResolvedValue(mockTabs);
            await chromeTabOperator.activateRightTabAndCloseCurrentTab(2);
            expect(chrome.tabs.update).toHaveBeenCalledWith(3, { active: true });
            expect(chrome.tabs.remove).toHaveBeenCalledWith(2);
        });

        it('最後のタブの場合は単に閉じるだけであること', async () => {
            (chrome.tabs.query as jest.Mock).mockResolvedValue(mockTabs);
            await chromeTabOperator.activateRightTabAndCloseCurrentTab(3);
            expect(chrome.tabs.update).not.toHaveBeenCalled();
            expect(chrome.tabs.remove).toHaveBeenCalledWith(3);
        });
    });

    describe('activateLeftTabメソッドのテスト', () => {
        it('左のタブをアクティブにできること', async () => {
            (chrome.tabs.query as jest.Mock).mockResolvedValue(mockTabs);
            await chromeTabOperator.activateLeftTab(2);
            expect(chrome.tabs.update).toHaveBeenCalledWith(1, { active: true });
        });

        it('最初のタブの場合は何もしないこと', async () => {
            (chrome.tabs.query as jest.Mock).mockResolvedValue(mockTabs);
            await chromeTabOperator.activateLeftTab(1);
            expect(chrome.tabs.update).not.toHaveBeenCalled();
        });
    });

    describe('activateRightTabメソッドのテスト', () => {
        it('右のタブをアクティブにできること', async () => {
            (chrome.tabs.query as jest.Mock).mockResolvedValue(mockTabs);
            await chromeTabOperator.activateRightTab(2);
            expect(chrome.tabs.update).toHaveBeenCalledWith(3, { active: true });
        });

        it('最後のタブの場合は何もしないこと', async () => {
            (chrome.tabs.query as jest.Mock).mockResolvedValue(mockTabs);
            await chromeTabOperator.activateRightTab(3);
            expect(chrome.tabs.update).not.toHaveBeenCalled();
        });
    });
}); 