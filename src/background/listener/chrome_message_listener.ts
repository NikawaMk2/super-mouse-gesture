import Logger from "../../common/utils/logger";
import { BackgroundGestureActionFactory } from "./gesture_action/background_gesture_action_factory";

export default class ChromeMessageListener {
    private boundHandleMessage: (request: any, sender: chrome.runtime.MessageSender, sendResponse: Function) => void;

    constructor() {
      this.boundHandleMessage = this.handleMessage.bind(this);
      chrome.runtime.onMessage.addListener(this.boundHandleMessage);
      Logger.debug('リスナー初期化');
    }

    // クリーンアップメソッド
    public dispose(): void {
      chrome.runtime.onMessage.removeListener(this.boundHandleMessage);
      Logger.debug('リスナー破棄');
    }
  
    // メッセージハンドラー
    private handleMessage(request: any, sender: chrome.runtime.MessageSender, sendResponse: Function) {
        Logger.debug('メッセージ受信');
      
      // リクエストのバリデーション
      if (!request || !request.action || typeof request.action !== 'string') {
        sendResponse({ success: false, error: 'Invalid request: action is required' });
        return true; // 非同期レスポンスの場合にtrueを返す
      }

      const action = BackgroundGestureActionFactory.createGestureAction(request.action);
      action.doAction(sender);
    }
  }