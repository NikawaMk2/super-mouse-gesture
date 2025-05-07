import { DragAction } from './drag_action';
import { DragActionMessagePayload } from '../../../content/services/message/message_types';
import Logger from '../../../common/logger/logger';
import type { ITabOperator } from '../../../common/provider/tab_operator';
import { injectable, inject } from 'inversify';

@injectable()
export class OpenAsUrlDragAction implements DragAction {
    private tabOperator: ITabOperator;
    constructor(@inject('ITabOperator') tabOperator: ITabOperator) {
        this.tabOperator = tabOperator;
    }
    async execute(payload: DragActionMessagePayload): Promise<void> {
        Logger.debug('OpenAsUrlDragAction: execute() が呼び出されました', { payload });
        const text = payload.params.text;
        const newTab = payload.params.newTab ?? true;
        if (!text) {
            Logger.warn('URLとして開くテキストが指定されていません', { payload });
            return;
        }
        let url = text.trim();
        if (!/^https?:\/\//.test(url)) {
            url = 'http://' + url;
        }
        try {
            if (newTab) {
                await this.tabOperator.createTab(url, true);
            } else {
                await this.tabOperator.updateCurrentTab(url);
            }
        } catch (e: any) {
            Logger.error('タブ操作に失敗しました', { error: e?.message, url });
        }
    }
} 