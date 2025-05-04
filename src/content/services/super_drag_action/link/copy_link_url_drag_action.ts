import { SuperDragAction } from '../super_drag_action';
import Logger from '../../../../common/logger/logger';

export class CopyLinkUrlDragAction implements SuperDragAction {
    async execute(options: {
        type: 'text' | 'link' | 'image';
        direction: 'up' | 'right' | 'down' | 'left';
        actionName: string;
        params: Record<string, any>;
    }): Promise<void> {
        Logger.debug('CopyLinkUrlDragAction: execute() called', { options });
        const url = options.params.url;
        if (!url) {
            Logger.warn('コピーするリンクURLが指定されていません', { options });
            return;
        }
        try {
            await navigator.clipboard.writeText(url);
            Logger.debug('リンクURLをクリップボードにコピーしました', { url });
        } catch (e) {
            Logger.error('リンクURLのコピーに失敗しました', { error: e, url });
        }
    }
} 