import Logger from '../logger/logger';
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
                    Logger.debug('アクティブなタブが見つかりません');
                    resolve();
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
                        Logger.debug('アクティブなタブが見つかりません');
                        resolve();
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
                        Logger.debug('次のタブが見つかりません');
                        resolve();
                        return;
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
                        Logger.debug('アクティブなタブが見つかりません');
                        resolve();
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
                        Logger.debug('前のタブが見つかりません');
                        resolve();
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
                    Logger.debug('アクティブなタブが見つかりません');
                    resolve();
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
                    Logger.debug('アクティブなタブが見つかりません');
                    resolve();
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
                    Logger.debug('アクティブなタブが見つかりません');
                    resolve();
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

    async duplicateActiveTab(): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                const tab = tabs[0];
                if (!tab?.id) {
                    Logger.debug('アクティブなタブが見つかりません');
                    resolve();
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

    /**
     * アクティブタブを閉じて、左隣のタブをアクティブにする
     */
    async activateLeftAndCloseActiveTab(): Promise<void> {
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
                        Logger.debug('アクティブなタブが見つかりません');
                        resolve();
                        return;
                    }
                    const currentIndex = tabs.findIndex(tab => tab.id === activeTab.id);
                    if (currentIndex === -1) {
                        Logger.debug('アクティブなタブがウィンドウ内で見つかりません');
                        return;
                    }
                    // 左隣のタブを取得
                    const leftTab = tabs[currentIndex - 1];
                    const leftTabId = leftTab?.id;
                    // まずアクティブタブを閉じる
                    chrome.tabs.remove(activeTab.id!, () => {
                        if (chrome.runtime.lastError) {
                            reject(new Error(chrome.runtime.lastError.message));
                            return;
                        }
                        // 左隣のタブが存在すればアクティブ化
                        if (leftTabId) {
                            chrome.tabs.update(leftTabId, { active: true }, () => {
                                if (chrome.runtime.lastError) {
                                    reject(new Error(chrome.runtime.lastError.message));
                                } else {
                                    resolve();
                                }
                            });
                        } else {
                            // 左隣がなければresolve（左端タブを閉じた場合など）
                            resolve();
                        }
                    });
                });
            });
        });
    }

    async activateRightAndCloseActiveTab(): Promise<void> {
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
                        Logger.debug('アクティブなタブが見つかりません');
                        resolve();
                        return;
                    }
                    const currentIndex = tabs.findIndex(tab => tab.id === activeTab.id);
                    if (currentIndex === -1) {
                        Logger.debug('アクティブなタブがウィンドウ内で見つかりません');
                        return;
                    }
                    // 右隣のタブを取得
                    const rightTab = tabs[currentIndex + 1];
                    const rightTabId = rightTab?.id;
                    // まずアクティブタブを閉じる
                    chrome.tabs.remove(activeTab.id!, () => {
                        if (chrome.runtime.lastError) {
                            reject(new Error(chrome.runtime.lastError.message));
                            return;
                        }
                        // 右隣のタブが存在すればアクティブ化
                        if (rightTabId) {
                            chrome.tabs.update(rightTabId, { active: true }, () => {
                                if (chrome.runtime.lastError) {
                                    reject(new Error(chrome.runtime.lastError.message));
                                } else {
                                    resolve();
                                }
                            });
                        } else {
                            // 右隣がなければresolve（右端タブを閉じた場合など）
                            resolve();
                        }
                    });
                });
            });
        });
    }
} 