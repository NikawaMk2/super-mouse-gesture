import { injectable, inject } from 'inversify';
import Logger from '../../../common/utils/logger';
import TYPES from '../../../common/utils/types';
import { BackgroundGestureAction } from './background_gesture_action';
import { ChromeTabOperator } from '../../services/chrome_tab_operator';

@injectable()
export default class BackgroundSelectLeftTabGestureAction implements BackgroundGestureAction {
    constructor(
        @inject(TYPES.ChromeTabOperator) private readonly chromeTabOperator: ChromeTabOperator
    ) {}

    async doAction(sender: chrome.runtime.MessageSender): Promise<void> {
        if (!sender.tab?.id) {
            Logger.error('タブ情報が見つかりません。このアクションはタブのコンテンツスクリプトからのみ実行可能です。');
            return;
        }

        Logger.debug('バックグラウンドで「左のタブを選択」のジェスチャーを実行');
        await this.chromeTabOperator.activateLeftTab(sender.tab.id);
    }
}