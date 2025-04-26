import { GestureAction } from './gesture_action';
import Logger from '../../../common/logger/logger';

export class ScrollToTopGestureAction implements GestureAction {
    execute(): void {
        Logger.debug('ScrollToTopGestureAction: execute() が呼び出されました');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
} 