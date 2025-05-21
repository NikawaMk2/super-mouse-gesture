import { GestureAction } from './gesture_action';
import Logger from '../../../common/logger/logger';
import { ChromeMessageSender, IGestureActionMessageSender } from '../message/message_sender';

export class ToggleFullscreenGestureAction implements GestureAction {
    private messageSender: IGestureActionMessageSender;

    constructor(messageSender: IGestureActionMessageSender = new ChromeMessageSender()) {
        this.messageSender = messageSender;
    }

    async execute(): Promise<void> {
        Logger.debug('ToggleFullscreenGestureAction: execute() が呼び出されました');
        await this.messageSender.sendGestureAction({
            actionName: 'toggleFullscreen',
            params: {}
        });
    }
} 