import { injectable } from 'inversify';
import Logger from '../../../common/utils/logger';
import ContainerProvider from '../../../common/utils/container_provider';
import { BackgroundMessage } from '../../../common/messaging/types/background_message_type';
import { BackgroundMessenger } from '../../../common/messaging/background_messenger';

@injectable()
export default class CloseAndSelectRightTabGestureAction implements GestureAction {
    doAction(): void {
        Logger.debug('「このタブを閉じて右のタブを選択」のジェスチャーを実行');
        const messenger = ContainerProvider.container.get(BackgroundMessenger);
        messenger.sendMessage(BackgroundMessage.CloseAndSelectRightTab);
    }
}