import { IDragActionHandler } from './message_listener';
import { DragActionMessagePayload } from '../../content/services/message/message_types';
import Logger from '../../common/logger/logger';

export class DragActionHandler implements IDragActionHandler {
    async handle(payload: DragActionMessagePayload): Promise<void> {
        Logger.info('スーパードラッグアクション受信', { payload });
        // TODO: アクション名・typeごとに処理を分岐し、タブ操作等を実装
    }
} 