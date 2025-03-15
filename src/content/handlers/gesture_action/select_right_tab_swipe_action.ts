import { injectable } from 'inversify';
import Logger from '../../../common/utils/logger';

@injectable()
export default class SelectRightTabGestureAction implements GestureAction {
    doAction(): void {
        Logger.debug('「右のタブを選択」のジェスチャーを実行');
    }
}