import { GestureAction } from './gesture_action';
import Logger from '../../../common/logger/logger';
import { ChromeMessageSender, IGestureActionMessageSender } from '../message/message_sender';

export class CloseTabToRightGestureAction implements GestureAction {
    private messageSender: IGestureActionMessageSender;

    constructor(messageSender: IGestureActionMessageSender = new ChromeMessageSender()) {
        this.messageSender = messageSender;
    }

    async execute(): Promise<void> {
        Logger.debug('CloseTabToRightGestureAction: execute() が呼び出されました');
        await this.messageSender.sendGestureAction({
            actionName: 'closeTabToRight',
            params: {}
        });
    }
} 