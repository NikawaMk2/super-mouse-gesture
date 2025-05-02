import { IGestureActionHandler } from './message_listener';
import { GestureActionMessagePayload } from '../../content/services/message/message_types';
import Logger from '../../common/logger/logger';

export class GestureActionHandler implements IGestureActionHandler {
    async handle(payload: GestureActionMessagePayload): Promise<void> {
        Logger.info('ジェスチャアクション受信', { payload });
        // TODO: アクション名ごとに処理を分岐し、タブ操作等を実装
    }
} 