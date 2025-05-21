import { GestureAction } from './gesture_action';
import Logger from '../../../common/logger/logger';

export class ShowFindBarGestureAction implements GestureAction {
    execute(): void {
        Logger.debug('ShowFindBarGestureAction: execute() が呼び出されました');
        (window as any).find('');
    }
} 