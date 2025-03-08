import { injectable } from 'inversify';
import Logger from '../../../common/util/logger';

@injectable()
export default class CloseAndSelectLeftTabGestureAction implements GestureAction {
    doAction(): void {
        Logger.debug('「このタブを閉じて左のタブを選択」のジェスチャーを実行');
    }
}