import { GestureAction } from './gesture_action';
import Logger from '../../../common/logger/logger';
import { MessageSender } from '../message/message_sender';

export class MinimizeWindowGestureAction implements GestureAction {
    private messageSender: MessageSender;

    constructor(messageSender: MessageSender) {
        this.messageSender = messageSender;
    }

    execute(): void {
        Logger.debug('MinimizeWindowGestureAction: execute() が呼び出されました');
        this.messageSender.sendMessage({
            action: 'executeGestureAction',
            payload: {
                actionName: 'minimizeWindow',
                params: {}
            }
        });
    }
} 