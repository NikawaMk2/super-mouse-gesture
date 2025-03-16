import 'reflect-metadata';
import { injectable } from 'inversify';

@injectable()
export class ChromeTabOperator {
    async getCurrentWindowTabs(): Promise<chrome.tabs.Tab[]> {
        return await chrome.tabs.query({ currentWindow: true });
    }

    async activateTab(tabId: number): Promise<void> {
        await chrome.tabs.update(tabId, { active: true });
    }

    async removeTab(tabId: number): Promise<void> {
        await chrome.tabs.remove(tabId);
    }

    async activateLeftTabAndCloseCurrentTab(currentTabId: number): Promise<void> {
        const tabs = await this.getCurrentWindowTabs();
        const currentTabIndex = tabs.findIndex(tab => tab.id === currentTabId);

        if (currentTabIndex > 0) {
            const leftTab = tabs[currentTabIndex - 1];
            if (leftTab.id) {
                await this.activateTab(leftTab.id);
            }
        }

        await this.removeTab(currentTabId);
    }

    async activateRightTabAndCloseCurrentTab(currentTabId: number): Promise<void> {
        const tabs = await this.getCurrentWindowTabs();
        const currentTabIndex = tabs.findIndex(tab => tab.id === currentTabId);

        if (currentTabIndex < tabs.length - 1) {
            const rightTab = tabs[currentTabIndex + 1];
            if (rightTab.id) {
                await this.activateTab(rightTab.id);
            }
        }

        await this.removeTab(currentTabId);
    }

    async activateLeftTab(currentTabId: number): Promise<void> {
        const tabs = await this.getCurrentWindowTabs();
        const currentTabIndex = tabs.findIndex(tab => tab.id === currentTabId);

        if (currentTabIndex > 0) {
            const leftTab = tabs[currentTabIndex - 1];
            if (leftTab.id) {
                await this.activateTab(leftTab.id);
            }
        }
    }

    async activateRightTab(currentTabId: number): Promise<void> {
        const tabs = await this.getCurrentWindowTabs();
        const currentTabIndex = tabs.findIndex(tab => tab.id === currentTabId);

        if (currentTabIndex < tabs.length - 1) {
            const rightTab = tabs[currentTabIndex + 1];
            if (rightTab.id) {
                await this.activateTab(rightTab.id);
            }
        }
    }
} 