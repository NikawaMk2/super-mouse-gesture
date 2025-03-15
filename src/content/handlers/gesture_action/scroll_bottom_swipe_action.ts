import { injectable } from 'inversify';
import Logger from '../../../common/utils/logger';

@injectable()
export default class ScrollBottomGestureAction implements GestureAction {
    doAction(): void {
        Logger.debug('「ページの一番下へ」のジェスチャーを実行');
        window.scrollTo(0, document.documentElement.scrollHeight);
    }
}