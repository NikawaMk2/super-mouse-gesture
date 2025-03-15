import Logger from "../../common/utils/logger";

export default class ChromeMessageListener {
    constructor() {
      chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
      Logger.debug('リスナー初期化');
    }
  
    // メッセージハンドラー
    private handleMessage(request: any, sender: chrome.runtime.MessageSender, sendResponse: Function) {
        Logger.debug('メッセージ受信');
      
      // リクエストのバリデーション
      if (!request || !request.action || typeof request.action !== 'string') {
        sendResponse({ success: false, error: 'Invalid request: action is required' });
        return true; // 非同期レスポンスの場合にtrueを返す
      }

    }
  }