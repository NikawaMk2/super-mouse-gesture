import { injectable } from 'inversify';
import Logger from '../../../common/utils/logger';

@injectable()
export default class NoAction implements GestureAction {
    doAction(): void {
        Logger.debug('実行ジェスチャ無し');
    }
}