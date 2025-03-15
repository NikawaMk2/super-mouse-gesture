import { injectable } from 'inversify';
import Logger from '../../../common/utils/logger';

@injectable()
export default class ScrollDownGestureAction implements GestureAction {
    doAction(): void {
        Logger.debug('「下へスクロール」のジェスチャーを実行');
        window.scrollBy(0, -window.innerHeight);
    }
}