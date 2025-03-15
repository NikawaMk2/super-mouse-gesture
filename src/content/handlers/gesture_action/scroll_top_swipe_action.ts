import { injectable } from 'inversify';
import Logger from '../../../common/utils/logger';

@injectable()
export default class ScrollTopGestureAction implements GestureAction {
    doAction(): void {
        Logger.debug('「ページの一番上へ」のジェスチャーを実行');
        window.scrollTo(0, 0);
    }
}