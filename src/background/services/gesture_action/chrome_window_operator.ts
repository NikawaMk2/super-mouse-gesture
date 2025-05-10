import { IWindowOperator } from './i_window_operator';
import Logger from '../../../common/logger/logger';

export class ChromeWindowOperator implements IWindowOperator {
    async maximizeCurrentWindow(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!chrome.windows) {
                Logger.error('chrome.windows APIが利用できません');
                resolve();
                return;
            }
            chrome.windows.getCurrent((currentWindow) => {
                if (chrome.runtime.lastError) {
                    Logger.error('ウィンドウ取得に失敗しました', { error: chrome.runtime.lastError.message });
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                chrome.windows.update(currentWindow.id!, { state: 'maximized' }, () => {
                    if (chrome.runtime.lastError) {
                        Logger.error('ウィンドウ最大化に失敗しました', { error: chrome.runtime.lastError.message });
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        Logger.debug('ウィンドウを最大化しました', { windowId: currentWindow.id });
                        resolve();
                    }
                });
            });
        });
    }

    async minimizeCurrentWindow(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!chrome.windows) {
                Logger.error('chrome.windows APIが利用できません');
                resolve();
                return;
            }
            chrome.windows.getCurrent((currentWindow) => {
                if (chrome.runtime.lastError) {
                    Logger.error('ウィンドウ取得に失敗しました', { error: chrome.runtime.lastError.message });
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                chrome.windows.update(currentWindow.id!, { state: 'minimized' }, () => {
                    if (chrome.runtime.lastError) {
                        Logger.error('ウィンドウ最小化に失敗しました', { error: chrome.runtime.lastError.message });
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        Logger.debug('ウィンドウを最小化しました', { windowId: currentWindow.id });
                        resolve();
                    }
                });
            });
        });
    }

    async toggleFullscreenCurrentWindow(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!chrome.windows) {
                Logger.error('chrome.windows APIが利用できません');
                resolve();
                return;
            }
            chrome.windows.getCurrent((currentWindow) => {
                if (chrome.runtime.lastError) {
                    Logger.error('ウィンドウ取得に失敗しました', { error: chrome.runtime.lastError.message });
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                const newState = currentWindow.state === 'fullscreen' ? 'normal' : 'fullscreen';
                chrome.windows.update(currentWindow.id!, { state: newState }, () => {
                    if (chrome.runtime.lastError) {
                        Logger.error('ウィンドウのフルスクリーン切り替えに失敗しました', { error: chrome.runtime.lastError.message });
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        Logger.debug('ウィンドウのフルスクリーン状態を切り替えました', { windowId: currentWindow.id, newState });
                        resolve();
                    }
                });
            });
        });
    }

    async createNewWindow(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!chrome.windows) {
                Logger.error('chrome.windows APIが利用できません');
                resolve();
                return;
            }
            chrome.windows.create({}, (window) => {
                if (chrome.runtime.lastError) {
                    Logger.error('新しいウィンドウの作成に失敗しました', { error: chrome.runtime.lastError.message });
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    Logger.debug('新しいウィンドウを作成しました');
                    resolve();
                }
            });
        });
    }

    async createNewIncognitoWindow(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!chrome.windows) {
                Logger.error('chrome.windows APIが利用できません');
                resolve();
                return;
            }
            chrome.windows.create({ incognito: true }, (window) => {
                if (chrome.runtime.lastError) {
                    Logger.error('新しいシークレットウィンドウの作成に失敗しました', { error: chrome.runtime.lastError.message });
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    Logger.debug('新しいシークレットウィンドウを作成しました');
                    resolve();
                }
            });
        });
    }

    async closeCurrentWindow(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!chrome.windows) {
                Logger.error('chrome.windows APIが利用できません');
                resolve();
                return;
            }
            chrome.windows.getCurrent((currentWindow) => {
                if (chrome.runtime.lastError) {
                    Logger.error('ウィンドウ取得に失敗しました', { error: chrome.runtime.lastError.message });
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                chrome.windows.remove(currentWindow.id!, () => {
                    if (chrome.runtime.lastError) {
                        Logger.error('ウィンドウのクローズに失敗しました', { error: chrome.runtime.lastError.message });
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        Logger.debug('現在のウィンドウを閉じました', { windowId: currentWindow.id });
                        resolve();
                    }
                });
            });
        });
    }
} 