import { GestureAction } from './gesture_action';
import Logger from '../../../common/logger/logger';

export class ReloadPageGestureAction implements GestureAction {
    execute(): void {
        Logger.debug('ReloadPageGestureAction: execute() が呼び出されました');
        window.location.reload();
    }
} 