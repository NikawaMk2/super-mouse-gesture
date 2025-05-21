import { GestureAction } from './gesture_action';
import Logger from '../../../common/logger/logger';

export class ForwardGestureAction implements GestureAction {
    execute(): void {
        Logger.debug('ForwardGestureAction: execute() が呼び出されました');
        window.history.forward();
    }
} 