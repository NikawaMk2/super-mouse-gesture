import { ContentScriptMain } from './content_script_main';
import Logger from '../common/logger/logger';

let contentScriptMain: ContentScriptMain | null = new ContentScriptMain();
let wasAnyTargetAppeared = false;
let destroyTimer: number | null = null;

// 遅延破棄の時間設定（ミリ秒）
// 主なSPAでは以下の動的更新が発生する：
// - ページ遷移: 0.5〜1.5秒
// - 動画切り替え: 1〜2秒  
// - コメント読み込み: 0.5〜1秒
// - 広告表示: 1〜2秒
// 安全マージンを含めて2.5秒に設定（ほとんどの動的更新をカバーしつつ、応答性を保つ）
const DESTROY_DELAY_MS = 2500;

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

// ページ遷移や主要要素の消失時にdestroy

// 通常のページ遷移でpopstateが発火するページが存在するため、
// popstateでの破棄は行わない（設定更新時のみ破棄・再生成）

// MutationObserverで主要要素の消失を監視
// ただし、YouTubeなどの動的サイトでは要素の一時的な消失が頻繁に発生するため、
// 遅延破棄（3秒後）を実装し、その間に要素が復活した場合は破棄をキャンセル
const observeTargets = [
  () => document.querySelector('canvas'), // ジェスチャトレイル用canvas
  () => document.getElementById('smg-action-notification'), // 通知UI
];

const observer = new MutationObserver(() => {
  const allGone = observeTargets.every(fn => !fn());
  const anyAppeared = observeTargets.some(fn => !!fn());

  if (anyAppeared) {
    wasAnyTargetAppeared = true;
    // 要素が復活した場合、破棄タイマーをクリア
    if (destroyTimer !== null) {
      clearTimeout(destroyTimer);
      destroyTimer = null;
      Logger.debug('MutationObserver: 要素が復活したため破棄タイマーをクリア');
    }
  }

  if (wasAnyTargetAppeared && allGone && contentScriptMain) {
    // 即座に破棄せず、設定した遅延時間後に破棄する（遅延破棄）
    if (destroyTimer === null) {
      Logger.debug(`MutationObserver: 主要要素が消失、${DESTROY_DELAY_MS}ms後に破棄予定`);
      destroyTimer = window.setTimeout(() => {
        if (contentScriptMain) {
          Logger.debug('MutationObserver: 遅延破棄実行 - ContentScriptMainを破棄');
          contentScriptMain.destroy();
          contentScriptMain = null;
          observer.disconnect();
        }
        destroyTimer = null;
      }, DESTROY_DELAY_MS);
    }
  }
});

if (document.body) {
  Logger.debug('MutationObserver: document.bodyが存在するため監視開始');
  observer.observe(document.body, { childList: true, subtree: true });
} else {
  Logger.debug('MutationObserver: document.bodyが未定のためDOMContentLoaded待機');
  window.addEventListener('DOMContentLoaded', () => {
    if (document.body) {
      Logger.debug('MutationObserver: DOMContentLoaded後に監視開始');
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      Logger.error('MutationObserver: DOMContentLoaded後もdocument.bodyが存在しません');
    }
  });
}
