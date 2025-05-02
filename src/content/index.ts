import { ContentScriptMain } from './content_script_main';
import Logger from '../common/logger/logger';

let contentScriptMain: ContentScriptMain | null = new ContentScriptMain();

// Backgroundからの有効/無効切り替えや設定更新メッセージを受信
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // メッセージの型・値チェック
    if (!message || typeof message !== 'object') {
      Logger.debug('onMessage: 不正なメッセージ受信', { message });
      return false;
    }

    // toggleEnabledアクション
    if (message.action === 'toggleEnabled') {
      const payload = message.payload;
      if (payload && typeof payload.enabled === 'boolean') {
        Logger.debug('onMessage: toggleEnabled受信', { enabled: payload.enabled });
        if (payload.enabled) {
          if (!contentScriptMain) {
            contentScriptMain = new ContentScriptMain();
            Logger.debug('ContentScriptMainを新規生成');
          }
        } else {
          if (contentScriptMain) {
            contentScriptMain.destroy();
            contentScriptMain = null;
            Logger.debug('ContentScriptMainを破棄');
          }
        }
        sendResponse({ result: 'ok' });
        return true;
      }
      Logger.debug('onMessage: toggleEnabledのpayload不正', { payload });
      sendResponse({ result: 'invalid payload' });
      return false;
    }

    // settingsUpdatedアクション
    if (message.action === 'settingsUpdated') {
      Logger.debug('onMessage: settingsUpdated受信');
      if (contentScriptMain) {
        contentScriptMain.destroy();
        Logger.debug('ContentScriptMainを破棄（settingsUpdated）');
      }
      contentScriptMain = new ContentScriptMain();
      Logger.debug('ContentScriptMainを再生成（settingsUpdated）');
      sendResponse({ result: 'ok' });
      return true;
    }

    // 未対応action
    Logger.debug('onMessage: 未対応action受信', { action: message.action });
    return false;
  });
}

// ページアンロード時にdestroy
window.addEventListener('unload', () => {
  if (contentScriptMain) {
    contentScriptMain.destroy();
    contentScriptMain = null;
    Logger.debug('unload: ContentScriptMainを破棄');
  }
});
