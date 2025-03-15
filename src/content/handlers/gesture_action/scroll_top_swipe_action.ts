import { injectable } from 'inversify';
import Logger from '../../../common/utils/logger';
import { GestureAction } from './gesture_action';

@injectable()
export default class ScrollTopGestureAction implements GestureAction {
    doAction(): Promise<void> {
        return new Promise(() => {
            Logger.debug('「ページの一番上へ」のジェスチャーを実行');
            window.scrollTo(0, 0);
        })
    }
}