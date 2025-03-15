import { injectable } from 'inversify';
import Logger from '../../../common/utils/logger';
import { GestureAction } from './gesture_action';

@injectable()
export default class GoToNextGestureAction implements GestureAction {
    async doAction(): Promise<void> {
        Logger.debug('「進む」のジェスチャーを実行');
        window.history.forward();
    }
}