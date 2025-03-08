import { injectable } from 'inversify';
import Logger from '../../../common/util/logger';

@injectable()
export default class SelectLeftTabGestureAction implements GestureAction {
    doAction(): void {
        Logger.debug('「左のタブを選択」のジェスチャーを実行');
    }
}