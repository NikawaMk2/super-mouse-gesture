import { injectable } from 'inversify';
import Logger from '../../../common/utils/logger';
import ContainerProvider from '../../../common/utils/container_provider';
import { BackgroundMessenger } from '../../../common/messaging/background_messenger';
import { BackgroundMessage } from '../../../common/messaging/types/background_message_type';

@injectable()
export default class SelectLeftTabGestureAction implements GestureAction {
    doAction(): void {
        Logger.debug('「左のタブを選択」のジェスチャーを実行');
        const messenger = ContainerProvider.container.get(BackgroundMessenger);
        messenger.sendMessage(BackgroundMessage.SelectLeftTab);
    }
}