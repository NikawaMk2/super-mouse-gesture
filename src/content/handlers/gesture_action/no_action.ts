import { injectable } from 'inversify';
import Logger from '../../../common/utils/logger';
import { GestureAction } from './gesture_action';

@injectable()
export default class NoAction implements GestureAction {
    async doAction(): Promise<void> {
        Logger.debug('実行ジェスチャ無し');
    }
}