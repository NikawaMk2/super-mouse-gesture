import { GestureAction } from './gesture_action';
import Logger from '../../../common/logger/logger';

export class GoBackGestureAction implements GestureAction {
    execute(): void {
        Logger.debug('GoBackGestureAction: execute() が呼び出されました');
        window.history.back();
    }
} 