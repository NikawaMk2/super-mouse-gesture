import { DragAction } from './drag_action';
import { DragActionMessagePayload } from '../../../content/services/message/message_types';
import Logger from '../../../common/logger/logger';
import type { ITabOperator } from '../../../common/provider/tab_operator';
import { inject } from 'inversify';

export class OpenInForegroundTabDragAction implements DragAction {
    constructor(@inject('ITabOperator') private tabOperator: ITabOperator) {}
    async execute(payload: DragActionMessagePayload): Promise<void> {
        Logger.debug('OpenInForegroundTabDragAction: execute() が呼び出されました', { payload });
        if (payload.type !== 'link') {
            Logger.warn('リンクタイプ以外は未対応です', { payload });
            return;
        }
        const url = payload.params.url;
        if (!url) {
            Logger.warn('開くリンクURLが指定されていません', { payload });
            return;
        }
        try {
            const tab = await this.tabOperator.createTab(url, true);
            Logger.debug('フォアグラウンドタブでリンクを開きました', { tabId: tab.id, url });
        } catch (e: any) {
            Logger.error('フォアグラウンドタブでのリンクオープンに失敗', { error: e.message, url });
        }
    }
} 