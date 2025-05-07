import Logger from '../../common/logger/logger';
import {
    ContentToBackgroundMessage,
    GestureActionMessagePayload,
    DragActionMessagePayload
} from '../../content/services/message/message_types';
import { injectable, inject } from 'inversify';

export interface IGestureActionHandler {
    handle(payload: GestureActionMessagePayload): Promise<void>;
}

export interface IDragActionHandler {
    handle(payload: DragActionMessagePayload): Promise<void>;
}

@injectable()
export class MessageListener {
    private gestureActionHandler: IGestureActionHandler;
    private dragActionHandler: IDragActionHandler;

    constructor(
        @inject('IGestureActionHandler') gestureActionHandler: IGestureActionHandler,
        @inject('IDragActionHandler') dragActionHandler: IDragActionHandler
    ) {
        this.gestureActionHandler = gestureActionHandler;
        this.dragActionHandler = dragActionHandler;
    }

    public listen() {
        chrome.runtime.onMessage.addListener((message: ContentToBackgroundMessage, sender, sendResponse) => {
            (async () => {
                try {
                    switch (message.action) {
                        case 'executeGestureAction':
                            await this.gestureActionHandler.handle(message.payload);
                            break;
                        case 'executeDragAction':
                            await this.dragActionHandler.handle(message.payload);
                            break;
                        default:
                            Logger.warn('未対応のメッセージアクション', { action: message.action });
                    }
                    sendResponse({ success: true });
                } catch (error: any) {
                    Logger.error('メッセージ処理中にエラー', { error: error?.message, message });
                    sendResponse({ success: false, error: error?.message });
                }
            })();
            return true; // 非同期応答のためtrueを返す
        });
    }
} 