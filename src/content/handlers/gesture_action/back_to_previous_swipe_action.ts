import { injectable } from 'inversify';
import Logger from '../../../common/utils/logger';
import { GestureAction } from './gesture_action';

@injectable()
export default class BackToPreviousGestureAction implements GestureAction {
    async doAction(): Promise<void> {
        Logger.debug('「戻る」のジェスチャーを実行');
        window.history.back();
    }
}