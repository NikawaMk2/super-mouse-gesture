import { SuperDragAction } from '../super_drag_action';
import Logger from '../../../../common/logger/logger';

export class SearchImageGoogleDragAction implements SuperDragAction {
    async execute(options: {
        type: 'text' | 'link' | 'image';
        direction: 'up' | 'right' | 'down' | 'left';
        actionName: string;
        params: Record<string, any>;
    }): Promise<void> {
        Logger.debug('SearchImageGoogleDragAction: execute() called', { options });
        const imageUrl = options.params.imageUrl || options.params.url;
        const urlTemplate = options.params.url || 'https://www.google.com/searchbyimage?image_url=%s';
        if (!imageUrl) {
            Logger.warn('画像検索する画像URLが指定されていません', { options });
            return;
        }
        const searchUrl = urlTemplate.replace('%s', encodeURIComponent(imageUrl));
        window.open(searchUrl, '_blank');
    }
} 