import { GestureAction } from './gesture_action';
import Logger from '../../../common/logger/logger';

export class ScrollToBottomGestureAction implements GestureAction {
    execute(): void {
        Logger.debug('ScrollToBottomGestureAction: execute() が呼び出されました');
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    }
} 