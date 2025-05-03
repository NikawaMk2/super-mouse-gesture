import { ITabOperator } from './tab_operator';

export class ChromeTabOperator implements ITabOperator {
    async createTab(url: string, active: boolean): Promise<{ id?: number }> {
        return new Promise((resolve, reject) => {
            chrome.tabs.create({ url, active }, (tab) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve({ id: tab?.id });
                }
            });
        });
    }
} 