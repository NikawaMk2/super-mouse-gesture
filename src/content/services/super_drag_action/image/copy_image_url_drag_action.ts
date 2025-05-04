import { SuperDragAction } from '../super_drag_action';
import Logger from '../../../../common/logger/logger';

export class CopyImageUrlDragAction implements SuperDragAction {
    async execute(options: {
        type: 'text' | 'link' | 'image';
        direction: 'up' | 'right' | 'down' | 'left';
        actionName: string;
        params: Record<string, any>;
    }): Promise<void> {
        Logger.debug('CopyImageUrlDragAction: execute() called', { options });
        const url = options.params.url;
        if (!url) {
            Logger.warn('コピーする画像URLが指定されていません', { options });
            return;
        }
        try {
            await navigator.clipboard.writeText(url);
            Logger.debug('画像URLをクリップボードにコピーしました', { url });
        } catch (e) {
            Logger.error('画像URLのコピーに失敗しました', { error: e, url });
        }
    }
} 