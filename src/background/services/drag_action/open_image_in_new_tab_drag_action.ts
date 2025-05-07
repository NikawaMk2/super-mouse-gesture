import { DragAction } from './drag_action';
import { DragActionMessagePayload } from '../../../content/services/message/message_types';
import Logger from '../../../common/logger/logger';
import type { ITabOperator } from '../../../common/provider/tab_operator';
import { inject } from 'inversify';

export class OpenImageInNewTabDragAction implements DragAction {
    private tabOperator: ITabOperator;
    constructor(@inject('ITabOperator') tabOperator: ITabOperator) {
        this.tabOperator = tabOperator;
    }
    async execute(payload: DragActionMessagePayload): Promise<void> {
        Logger.debug('OpenImageInNewTabDragAction: execute() が呼び出されました', { payload });
        const url = payload.params.url;
        if (!url) {
            Logger.warn('新しいタブで開く画像URLが指定されていません', { payload });
            return;
        }
        try {
            await this.tabOperator.createTab(url, true);
            Logger.debug('画像を新しいタブで開きました', { url });
        } catch (e: any) {
            Logger.error('画像を新しいタブで開くのに失敗しました', { error: e?.message, url });
        }
    }
} 