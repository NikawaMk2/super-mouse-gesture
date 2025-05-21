import { ContentToBackgroundMessage, ContentToBackgroundResponse, DragActionMessagePayload, GestureActionMessagePayload } from './message_types';
// chrome拡張API型のグローバル宣言
// @ts-ignore
declare const chrome: any;

export interface IGestureActionMessageSender {
    sendGestureAction(payload: GestureActionMessagePayload): Promise<ContentToBackgroundResponse>;
}

export interface IDragActionMessageSender {
    sendDragAction(payload: DragActionMessagePayload): Promise<ContentToBackgroundResponse>;
}

export class ChromeMessageSender implements IGestureActionMessageSender, IDragActionMessageSender {
    async sendGestureAction(payload: GestureActionMessagePayload): Promise<ContentToBackgroundResponse> {
        const message: ContentToBackgroundMessage = {
            action: 'executeGestureAction',
            payload
        };
        return this.sendMessage(message);
    }

    async sendDragAction(payload: DragActionMessagePayload): Promise<ContentToBackgroundResponse> {
        const message: ContentToBackgroundMessage = {
            action: 'executeDragAction',
            payload
        };
        return this.sendMessage(message);
    }
    
    private async sendMessage(message: ContentToBackgroundMessage): Promise<ContentToBackgroundResponse> {
        return new Promise((resolve, reject) => {
            try {
                chrome.runtime.sendMessage(message, (response: ContentToBackgroundResponse) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    }
                    resolve(response);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
} 