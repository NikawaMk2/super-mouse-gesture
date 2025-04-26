import { GestureAction } from './gesture_action';
import Logger from '../../../common/logger/logger';
import { MessageSender } from '../message/message_sender';

export class MaximizeWindowGestureAction implements GestureAction {
    private messageSender: MessageSender;

    constructor(messageSender: MessageSender) {
        this.messageSender = messageSender;
    }

    execute(): void {
        Logger.debug('MaximizeWindowGestureAction: execute() が呼び出されました');
        this.messageSender.sendMessage({
            action: 'executeGestureAction',
            payload: {
                actionName: 'maximizeWindow',
                params: {}
            }
        });
    }
} 