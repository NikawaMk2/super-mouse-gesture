import { DragAction } from './drag_action';
import { DragActionMessagePayload } from '../../../content/services/message/message_types';
import Logger from '../../../common/logger/logger';
import { ITabOperator } from '../../../common/provider/tab_operator';

export class SearchImageGoogleDragAction implements DragAction {
    private tabOperator: ITabOperator;
    constructor(tabOperator: ITabOperator) {
        this.tabOperator = tabOperator;
    }
    async execute(payload: DragActionMessagePayload): Promise<void> {
        Logger.debug('SearchImageGoogleDragAction: execute() が呼び出されました', { payload });
        const url = payload.params.url;
        if (!url) {
            Logger.warn('Google画像検索する画像URLが指定されていません', { payload });
            return;
        }
        const searchUrl = 'https://www.google.com/searchbyimage?image_url=' + encodeURIComponent(url);
        try {
            await this.tabOperator.createTab(searchUrl, true);
            Logger.debug('Google画像検索タブを新規作成しました', { searchUrl });
        } catch (e: any) {
            Logger.error('Google画像検索タブの作成に失敗しました', { error: e?.message, searchUrl });
        }
    }
} 