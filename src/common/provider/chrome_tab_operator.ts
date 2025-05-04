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

    async updateCurrentTab(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                if (tabs[0]?.id) {
                    chrome.tabs.update(tabs[0].id, { url }, () => {
                        if (chrome.runtime.lastError) {
                            reject(new Error(chrome.runtime.lastError.message));
                        } else {
                            resolve();
                        }
                    });
                } else {
                    reject(new Error('アクティブなタブが見つかりません'));
                }
            });
        });
    }
} 