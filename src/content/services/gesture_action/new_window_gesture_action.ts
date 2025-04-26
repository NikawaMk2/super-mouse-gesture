import { GestureAction } from './gesture_action';
import Logger from '../../../common/logger/logger';
import { MessageSender } from '../message/message_sender';

export class NewWindowGestureAction implements GestureAction {
    private messageSender: MessageSender;

    constructor(messageSender: MessageSender) {
        this.messageSender = messageSender;
    }

    execute(): void {
        Logger.debug('NewWindowGestureAction: execute() が呼び出されました');
        this.messageSender.sendMessage({
            action: 'executeGestureAction',
            payload: {
                actionName: 'newWindow',
                params: {}
            }
        });
    }
} 