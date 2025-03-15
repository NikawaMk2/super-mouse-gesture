import { injectable } from 'inversify';
import Logger from '../../../common/utils/logger';
import { GestureAction } from './gesture_action';

@injectable()
export default class ScrollUpGestureAction implements GestureAction {
    doAction(): Promise<void> {
        return new Promise(() => {
            Logger.debug('「上へスクロール」のジェスチャーを実行');
            window.scrollBy(0, window.innerHeight);
        })
    }
}