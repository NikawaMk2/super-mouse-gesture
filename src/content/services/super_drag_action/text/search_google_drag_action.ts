import { SuperDragAction } from '../super_drag_action';
import Logger from '../../../../common/logger/logger';

export class SearchGoogleDragAction implements SuperDragAction {
    async execute(options: {
        type: 'text' | 'link' | 'image';
        direction: 'up' | 'right' | 'down' | 'left';
        actionName: string;
        params: Record<string, any>;
    }): Promise<void> {
        Logger.debug('SearchGoogleDragAction: execute() called', { options });
        const text = options.params.text;
        const urlTemplate = options.params.url || 'https://www.google.com/search?q=%s';
        if (!text) {
            Logger.warn('検索テキストが指定されていません', { options });
            return;
        }
        const searchUrl = urlTemplate.replace('%s', encodeURIComponent(text));
        window.open(searchUrl, '_blank');
    }
} 