import Logger from "../../common/utils/logger";
import { BackgroundGestureActionFactory } from "./gesture_action/background_gesture_action_factory";

export default class ChromeMessageListener {
    private boundHandleMessage: (request: any, sender: chrome.runtime.MessageSender, sendResponse: Function) => boolean;

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
    private handleMessage(request: any, sender: chrome.runtime.MessageSender, sendResponse: Function): boolean {
        Logger.debug(`メッセージ受信: ${JSON.stringify(request)}`);
      
        // リクエストのバリデーション
        if (!request || !request.action || typeof request.action !== 'string') {
            sendResponse({ success: false, error: 'Invalid request: action is required' });
            return true;
        }

        try {
            const action = BackgroundGestureActionFactory.createGestureAction(request.action);
            action.doAction(sender)
                .then(() => {
                    sendResponse({ success: true });
                })
                .catch((error: unknown) => {
                    Logger.error(`アクション実行エラー: ${error instanceof Error ? error.message : String(error)}`);
                    sendResponse({
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error occurred'
                    });
                });
        } catch (error: unknown) {
            Logger.error(`アクション作成エラー: ${error instanceof Error ? error.message : String(error)}`);
            sendResponse({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }

        return true;
    }
}