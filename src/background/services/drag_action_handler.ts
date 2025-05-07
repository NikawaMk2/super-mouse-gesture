import { IDragActionHandler } from './message_listener';
import { DragActionMessagePayload } from '../../content/services/message/message_types';
import Logger from '../../common/logger/logger';
import { DragActionFactory } from './drag_action/drag_action_factory';
import { BackgroundContainerProvider } from '../provider/background_container_provider';

export class DragActionHandler implements IDragActionHandler {
    async handle(payload: DragActionMessagePayload): Promise<void> {
        Logger.debug('スーパードラッグアクション受信', { payload });
        try {
            const container = new BackgroundContainerProvider().getContainer();
            const action = DragActionFactory.create(payload.actionName, container);
            await action.execute(payload);
            Logger.debug('スーパードラッグアクション実行完了', { actionName: payload.actionName });
        } catch (error: any) {
            Logger.error('スーパードラッグアクション実行エラー', { error: error?.message, payload });
        }
    }
} 