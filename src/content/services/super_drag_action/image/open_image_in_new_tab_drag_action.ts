import { SuperDragAction } from '../super_drag_action';
import Logger from '../../../../common/logger/logger';

export class OpenImageInNewTabDragAction implements SuperDragAction {
    async execute(options: {
        type: 'text' | 'link' | 'image';
        direction: 'up' | 'right' | 'down' | 'left';
        actionName: string;
        params: Record<string, any>;
    }): Promise<void> {
        Logger.debug('OpenImageInNewTabDragAction: execute() called', { options });
        const url = options.params.url;
        if (!url) {
            Logger.warn('開く画像URLが指定されていません', { options });
            return;
        }
        window.open(url, '_blank');
    }
} 