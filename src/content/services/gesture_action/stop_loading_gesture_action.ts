import { GestureAction } from './gesture_action';
import Logger from '../../../common/logger/logger';

export class StopLoadingGestureAction implements GestureAction {
    execute(): void {
        Logger.debug('StopLoadingGestureAction: execute() が呼び出されました');
        window.stop();
    }
} 