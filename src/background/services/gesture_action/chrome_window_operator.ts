import { IWindowOperator } from './i_window_operator';
import Logger from '../../../common/logger/logger';

export class ChromeWindowOperator implements IWindowOperator {
    async maximizeCurrentWindow(): Promise<void> {
        try {
            if (!chrome.windows) {
                Logger.error('chrome.windows APIが利用できません');
                return;
            }
            const currentWindow = await chrome.windows.getCurrent();
            await chrome.windows.update(currentWindow.id!, { state: 'maximized' });
            Logger.debug('ウィンドウを最大化しました', { windowId: currentWindow.id });
        } catch (e: any) {
            Logger.error('ウィンドウ最大化に失敗しました', { error: e?.message });
        }
    }

    async minimizeCurrentWindow(): Promise<void> {
        try {
            if (!chrome.windows) {
                Logger.error('chrome.windows APIが利用できません');
                return;
            }
            const currentWindow = await chrome.windows.getCurrent();
            await chrome.windows.update(currentWindow.id!, { state: 'minimized' });
            Logger.debug('ウィンドウを最小化しました', { windowId: currentWindow.id });
        } catch (e: any) {
            Logger.error('ウィンドウ最小化に失敗しました', { error: e?.message });
        }
    }

    async toggleFullscreenCurrentWindow(): Promise<void> {
        try {
            if (!chrome.windows) {
                Logger.error('chrome.windows APIが利用できません');
                return;
            }
            const currentWindow = await chrome.windows.getCurrent();
            const newState = currentWindow.state === 'fullscreen' ? 'normal' : 'fullscreen';
            await chrome.windows.update(currentWindow.id!, { state: newState });
            Logger.debug('ウィンドウのフルスクリーン状態を切り替えました', { windowId: currentWindow.id, newState });
        } catch (e: any) {
            Logger.error('ウィンドウのフルスクリーン切り替えに失敗しました', { error: e?.message });
        }
    }

    async createNewWindow(): Promise<void> {
        try {
            if (!chrome.windows) {
                Logger.error('chrome.windows APIが利用できません');
                return;
            }
            await chrome.windows.create({});
            Logger.debug('新しいウィンドウを作成しました');
        } catch (e: any) {
            Logger.error('新しいウィンドウの作成に失敗しました', { error: e?.message });
        }
    }

    async createNewIncognitoWindow(): Promise<void> {
        try {
            if (!chrome.windows) {
                Logger.error('chrome.windows APIが利用できません');
                return;
            }
            await chrome.windows.create({ incognito: true });
            Logger.debug('新しいシークレットウィンドウを作成しました');
        } catch (e: any) {
            Logger.error('新しいシークレットウィンドウの作成に失敗しました', { error: e?.message });
        }
    }

    async closeCurrentWindow(): Promise<void> {
        try {
            if (!chrome.windows) {
                Logger.error('chrome.windows APIが利用できません');
                return;
            }
            const currentWindow = await chrome.windows.getCurrent();
            await chrome.windows.remove(currentWindow.id!);
            Logger.debug('現在のウィンドウを閉じました', { windowId: currentWindow.id });
        } catch (e: any) {
            Logger.error('ウィンドウのクローズに失敗しました', { error: e?.message });
        }
    }
} 