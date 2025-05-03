import { GestureActionMessagePayload } from '../message/message_types';
import Logger from '../../../common/logger/logger';

export class NoneGestureAction {
    async execute(payload: GestureActionMessagePayload): Promise<void> {
        Logger.debug('NoneGestureAction: execute() が呼び出されました', { payload });
        // 何もしない
    }
} 