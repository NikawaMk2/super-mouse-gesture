import { injectable } from 'inversify';
import Logger from '../../../common/util/logger';

@injectable()
export default class BackToPreviousGestureAction implements GestureAction {
    doAction(): void {
        Logger.debug('「戻る」のジェスチャーを実行');
        window.history.back();
    }
}