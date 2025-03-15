import { injectable } from 'inversify';
import Logger from '../../../common/utils/logger';
import { GestureAction } from './gesture_action';

@injectable()
export default class ScrollDownGestureAction implements GestureAction {
    async doAction(): Promise<void> {
        Logger.debug('「下へスクロール」のジェスチャーを実行');
        window.scrollBy(0, -window.innerHeight);
    }
}