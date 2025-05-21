import { GestureAction } from './gesture_action';
import Logger from '../../../common/logger/logger';
import { ChromeMessageSender, IGestureActionMessageSender } from '../message/message_sender';

export class PrevTabGestureAction implements GestureAction {
    private messageSender: IGestureActionMessageSender;

    constructor(messageSender: IGestureActionMessageSender = new ChromeMessageSender()) {
        this.messageSender = messageSender;
    }

    async execute(): Promise<void> {
        Logger.debug('PrevTabGestureAction: execute() が呼び出されました');
        await this.messageSender.sendGestureAction({
            actionName: 'prevTab',
            params: {}
        });
    }
} 