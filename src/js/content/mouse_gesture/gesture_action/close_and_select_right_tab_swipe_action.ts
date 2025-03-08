import { injectable } from 'inversify';
import Logger from '../../../common/util/logger';

@injectable()
export default class CloseAndSelectRightTabGestureAction implements GestureAction {
    doAction(): void {
        Logger.debug('「このタブを閉じて右のタブを選択」のジェスチャーを実行');
    }
}