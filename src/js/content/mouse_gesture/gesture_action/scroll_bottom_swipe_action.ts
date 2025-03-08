import { injectable } from 'inversify';
import Logger from '../../../common/util/logger';

@injectable()
export default class ScrollBottomGestureAction implements GestureAction {
    doAction(): void {
        Logger.debug('「ページの一番下へ」のジェスチャーを実行');
    }
}