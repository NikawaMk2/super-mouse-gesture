import { injectable } from 'inversify';
import Logger from '../utils/logger';
import { BackgroundMessageType } from './types/background_message_type';
import { MessageSender } from './message_sender';

@injectable()
export class BackgroundMessenger implements MessageSender {
    async sendMessage<T>(message: BackgroundMessageType): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (!chrome.runtime || !chrome.runtime.sendMessage) {
                Logger.error('chrome.runtime.sendMessageが未定義です');
                reject(new Error('chrome.runtime.sendMessageが未定義です'));
                return;
            }

            Logger.debug(`バックグラウンドにメッセージを送信:${message}`);
            chrome.runtime.sendMessage({ action: message })
            .then(response => {
                if (chrome.runtime.lastError) {
                    Logger.error(`バックグラウンドへのメッセージ送信に失敗:${chrome.runtime.lastError}`);
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }

                Logger.debug(`バックグラウンドからのレスポンス:${response}`);
                resolve(response);
            })
            .catch(error => {
                Logger.error(`バックグラウンドへのメッセージ送信に失敗:${error}`);
                reject(error);
            });    
        });
    }
} 