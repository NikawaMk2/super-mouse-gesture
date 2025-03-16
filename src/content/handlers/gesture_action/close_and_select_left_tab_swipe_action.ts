import '../../../common/utils/reflect_metadata';
import { injectable, inject } from 'inversify';
import Logger from '../../../common/utils/logger';
import type { MessageSender } from '../../../common/messaging/message_sender';
import BackgroundMessage from '../../../common/messaging/types/background_message_type';
import TYPES from '../../../common/utils/types';
import type { GestureAction } from './gesture_action';

@injectable()
export default class CloseAndSelectLeftTabGestureAction implements GestureAction {
    constructor(
        @inject(TYPES.MessageSender) private readonly messenger: MessageSender
    ) {}

    async doAction(): Promise<void> {
        Logger.debug('「このタブを閉じて左のタブを選択」のジェスチャーを実行');
        await this.messenger.sendMessage(BackgroundMessage.CloseAndSelectLeftTab);
    }
}