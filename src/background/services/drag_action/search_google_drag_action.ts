import { DragAction } from './drag_action';
import { DragActionMessagePayload } from '../../../content/services/message/message_types';
import Logger from '../../../common/logger/logger';

export class SearchGoogleDragAction implements DragAction {
    async execute(payload: DragActionMessagePayload): Promise<void> {
        Logger.info('SearchGoogleDragAction: execute() が呼び出されました', { payload });
        const text = payload.params.text;
        const urlTemplate = payload.params.url || 'https://www.google.com/search?q=%s';
        if (!text) {
            Logger.warn('検索テキストが指定されていません', { payload });
            return;
        }
        const searchUrl = urlTemplate.replace('%s', encodeURIComponent(text));
        // バックグラウンドからタブを開く
        chrome.tabs.create({ url: searchUrl });
    }
} 