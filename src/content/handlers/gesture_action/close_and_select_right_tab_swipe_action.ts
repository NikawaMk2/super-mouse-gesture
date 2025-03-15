import { injectable, inject } from 'inversify';
import Logger from '../../../common/utils/logger';
import * as message_sender from '../../../common/messaging/message_sender';
import { BackgroundMessage } from '../../../common/messaging/types/background_message_type';
import { TYPES } from '../../../common/utils/container_provider';
import { GestureAction } from './gesture_action';

@injectable()
export default class CloseAndSelectRightTabGestureAction implements GestureAction {
    constructor(
        @inject(TYPES.MessageSender) private readonly messenger: message_sender.MessageSender
    ) {}

    async doAction(): Promise<void> {
        Logger.debug('「このタブを閉じて右のタブを選択」のジェスチャーを実行');
        await this.messenger.sendMessage(BackgroundMessage.CloseAndSelectRightTab);
    }
}