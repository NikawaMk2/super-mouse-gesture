import { ContentToBackgroundMessage, ContentToBackgroundResponse } from './message_types';
// chrome拡張API型のグローバル宣言
// @ts-ignore
declare const chrome: any;

export interface MessageSender {
    sendMessage(message: ContentToBackgroundMessage): Promise<ContentToBackgroundResponse>;
}

export class ChromeMessageSender implements MessageSender {
    sendMessage(message: ContentToBackgroundMessage): Promise<ContentToBackgroundResponse> {
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