import { DragAction } from './drag_action';
import { DragActionMessagePayload } from '../../../content/services/message/message_types';
import Logger from '../../../common/logger/logger';
import type { ITabOperator } from '../../../common/provider/tab_operator';
import { inject } from 'inversify';

export class SearchImageGoogleDragAction implements DragAction {
    private tabOperator: ITabOperator;
    constructor(@inject('ITabOperator') tabOperator: ITabOperator) {
        this.tabOperator = tabOperator;
    }
    async execute(payload: DragActionMessagePayload): Promise<void> {
        Logger.debug('SearchImageGoogleDragAction: execute() が呼び出されました', { payload });
        const urlTemplate = payload.params?.urlTemplate || 'https://www.google.com/searchbyimage?image_url=%s';
        const imageUrl = payload.selectedValue;
        if (!imageUrl) {
            Logger.warn('Google画像検索する画像URLが指定されていません', { payload });
            return;
        }
        const searchUrl = urlTemplate.replace('%s', encodeURIComponent(imageUrl));
        try {
            await this.tabOperator.createTab(searchUrl, true);
            Logger.debug('Google画像検索タブを新規作成しました', { searchUrl });
        } catch (e: any) {
            Logger.error('Google画像検索タブの作成に失敗しました', { error: e?.message, searchUrl });
        }
    }
} 