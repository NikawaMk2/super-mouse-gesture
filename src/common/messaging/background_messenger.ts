import { injectable } from 'inversify';
import Logger from '../utils/logger';
import { BackgroundMessageType } from './types/background_message_type';
import { MessageSender } from './message_sender';

@injectable()
export class BackgroundMessenger implements MessageSender {
    async sendMessage<T>(message: BackgroundMessageType): Promise<T> {
        try {
            Logger.debug(`バックグラウンドにメッセージを送信:${message}`);
            return await chrome.runtime.sendMessage(message);
        } catch (error) {
            Logger.error(`バックグラウンドへのメッセージ送信に失敗:${error}`);
            throw error;
        }
    }
} 