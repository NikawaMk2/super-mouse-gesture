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

    async switchToNextTab(): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                        return;
                    }
                    const activeTab = activeTabs[0];
                    if (!activeTab) {
                        reject(new Error('アクティブなタブが見つかりません'));
                        return;
                    }
                    const currentIndex = tabs.findIndex(tab => tab.id === activeTab.id);
                    const nextIndex = (currentIndex + 1) % tabs.length;
                    const nextTab = tabs[nextIndex];
                    if (nextTab?.id) {
                        chrome.tabs.update(nextTab.id, { active: true }, () => {
                            if (chrome.runtime.lastError) {
                                reject(new Error(chrome.runtime.lastError.message));
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        reject(new Error('次のタブが見つかりません'));
                    }
                });
            });
        });
    }

    async switchToPrevTab(): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                        return;
                    }
                    const activeTab = activeTabs[0];
                    if (!activeTab) {
                        reject(new Error('アクティブなタブが見つかりません'));
                        return;
                    }
                    const currentIndex = tabs.findIndex(tab => tab.id === activeTab.id);
                    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                    const prevTab = tabs[prevIndex];
                    if (prevTab?.id) {
                        chrome.tabs.update(prevTab.id, { active: true }, () => {
                            if (chrome.runtime.lastError) {
                                reject(new Error(chrome.runtime.lastError.message));
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        reject(new Error('前のタブが見つかりません'));
                    }
                });
            });
        });
    }

    async togglePinActiveTab(): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                const tab = tabs[0];
                if (!tab?.id) {
                    reject(new Error('アクティブなタブが見つかりません'));
                    return;
                }
                chrome.tabs.update(tab.id, { pinned: !tab.pinned }, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve();
                    }
                });
            });
        });
    }

    async toggleMuteActiveTab(): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                const tab = tabs[0];
                if (!tab?.id) {
                    reject(new Error('アクティブなタブが見つかりません'));
                    return;
                }
                chrome.tabs.update(tab.id, { muted: !tab.mutedInfo?.muted }, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve();
                    }
                });
            });
        });
    }

    async closeActiveTab(): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                const tab = tabs[0];
                if (!tab?.id) {
                    reject(new Error('アクティブなタブが見つかりません'));
                    return;
                }
                chrome.tabs.remove(tab.id, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve();
                    }
                });
            });
        });
    }

    async closeTabsToRight(): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                        return;
                    }
                    const activeTab = activeTabs[0];
                    if (!activeTab) {
                        reject(new Error('アクティブなタブが見つかりません'));
                        return;
                    }
                    const currentIndex = tabs.findIndex(tab => tab.id === activeTab.id);
                    const tabsToRight = tabs.slice(currentIndex + 1).filter(tab => tab.id !== undefined);
                    const tabIds = tabsToRight.map(tab => tab.id!);
                    if (tabIds.length === 0) {
                        resolve();
                        return;
                    }
                    chrome.tabs.remove(tabIds, () => {
                        if (chrome.runtime.lastError) {
                            reject(new Error(chrome.runtime.lastError.message));
                        } else {
                            resolve();
                        }
                    });
                });
            });
        });
    }

    async closeTabsToLeft(): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                        return;
                    }
                    const activeTab = activeTabs[0];
                    if (!activeTab) {
                        reject(new Error('アクティブなタブが見つかりません'));
                        return;
                    }
                    const currentIndex = tabs.findIndex(tab => tab.id === activeTab.id);
                    const tabsToLeft = tabs.slice(0, currentIndex).filter(tab => tab.id !== undefined);
                    const tabIds = tabsToLeft.map(tab => tab.id!);
                    if (tabIds.length === 0) {
                        resolve();
                        return;
                    }
                    chrome.tabs.remove(tabIds, () => {
                        if (chrome.runtime.lastError) {
                            reject(new Error(chrome.runtime.lastError.message));
                        } else {
                            resolve();
                        }
                    });
                });
            });
        });
    }

    async duplicateActiveTab(): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                const tab = tabs[0];
                if (!tab?.id) {
                    reject(new Error('アクティブなタブが見つかりません'));
                    return;
                }
                chrome.tabs.duplicate(tab.id, (newTab) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve();
                    }
                });
            });
        });
    }

    async reopenClosedTab(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (chrome.sessions && chrome.sessions.restore) {
                chrome.sessions.restore((session) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve();
                    }
                });
            } else {
                reject(new Error('chrome.sessions APIが利用できません'));
            }
        });
    }
} 