import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import Logger from '../../../common/utils/logger';
import { TYPES } from '../../../common/utils/container_provider';
import { BackgroundGestureAction } from './background_gesture_action';
import { ChromeTabOperator } from '../../services/chrome_tab_operator';

@injectable()
export default class BackgroundCloseAndSelectLeftTabGestureAction implements BackgroundGestureAction {
    constructor(
        @inject(TYPES.ChromeTabOperator) private readonly chromeTabOperator: ChromeTabOperator
    ) {}

    async doAction(sender: chrome.runtime.MessageSender): Promise<void> {
        if (!sender.tab?.id) {
            Logger.error('タブ情報が見つかりません。このアクションはタブのコンテンツスクリプトからのみ実行可能です。');
            return;
        }

        Logger.debug('バックグラウンドで「このタブを閉じて左のタブを選択」のジェスチャーを実行');
        await this.chromeTabOperator.activateLeftTabAndCloseCurrentTab(sender.tab.id);
    }
}