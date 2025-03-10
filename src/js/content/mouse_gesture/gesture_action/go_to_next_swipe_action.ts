import { injectable } from 'inversify';
import Logger from '../../../common/util/logger';

@injectable()
export default class GoToNextGestureAction implements GestureAction {
    doAction(): void {
        Logger.debug('「進む」のジェスチャーを実行');
        window.history.forward();
    }
}