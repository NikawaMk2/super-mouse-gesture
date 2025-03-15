import { injectable } from 'inversify';
import Logger from '../../../common/utils/logger';
import { GestureAction } from './gesture_action';

@injectable()
export default class ScrollBottomGestureAction implements GestureAction {
    async doAction(): Promise<void> {
        Logger.debug('「ページの一番下へ」のジェスチャーを実行');
        window.scrollTo(0, document.documentElement.scrollHeight);
    }
}