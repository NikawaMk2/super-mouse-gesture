import { injectable } from 'inversify';
import Logger from '../../../common/util/logger';

@injectable()
export default class ScrollUpGestureAction implements GestureAction {
    doAction(): void {
        Logger.debug('「上へスクロール」のジェスチャーを実行');
        window.scrollBy(0, window.innerHeight);
    }
}