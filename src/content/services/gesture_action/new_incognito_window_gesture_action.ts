import { GestureAction } from './gesture_action';
import Logger from '../../../common/logger/logger';
import { MessageSender } from '../message/message_sender';

export class NewIncognitoWindowGestureAction implements GestureAction {
    private messageSender: MessageSender;

    constructor(messageSender: MessageSender) {
        this.messageSender = messageSender;
    }

    execute(): void {
        Logger.debug('NewIncognitoWindowGestureAction: execute() が呼び出されました');
        this.messageSender.sendMessage({
            action: 'executeGestureAction',
            payload: {
                actionName: 'newIncognitoWindow',
                params: {}
            }
        });
    }
} 