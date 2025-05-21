import { GestureAction } from './gesture_action';
import Logger from '../../../common/logger/logger';
import { ChromeMessageSender, IGestureActionMessageSender } from '../message/message_sender';

export class PinTabGestureAction implements GestureAction {
    private messageSender: IGestureActionMessageSender;

    constructor(messageSender: IGestureActionMessageSender = new ChromeMessageSender()) {
        this.messageSender = messageSender;
    }

    async execute(): Promise<void> {
        Logger.debug('PinTabGestureAction: execute() が呼び出されました');
        await this.messageSender.sendGestureAction({
            actionName: 'pinTab',
            params: {}
        });
    }
} 