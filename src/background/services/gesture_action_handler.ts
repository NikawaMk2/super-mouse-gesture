import { IGestureActionHandler } from './message_listener';
import { GestureActionMessagePayload } from '../../content/services/message/message_types';
import Logger from '../../common/logger/logger';
import { injectable } from 'inversify';
import { BackgroundContainerProvider } from '../provider/background_container_provider';
import { GestureActionType } from './gesture_action/gesture_action_type';
import { GestureActionFactory } from '../services/gesture_action/gesture_action_factory';

@injectable()
export class GestureActionHandler implements IGestureActionHandler {
    async handle(payload: GestureActionMessagePayload): Promise<void> {
        Logger.debug('ジェスチャアクション受信', { payload });
        try {
            const container = new BackgroundContainerProvider().getContainer();
            const actionType = payload.actionName as GestureActionType;
            const action = GestureActionFactory.create(actionType, container);
            await action.execute();
            Logger.info('ジェスチャアクション実行完了', { actionName: payload.actionName });
        } catch (error: any) {
            Logger.error('ジェスチャアクション実行エラー', { error: error?.message, payload });
        }
    }
} 