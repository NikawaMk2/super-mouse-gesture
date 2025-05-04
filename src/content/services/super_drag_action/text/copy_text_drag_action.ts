import { SuperDragAction } from '../super_drag_action';
import Logger from '../../../../common/logger/logger';

export class CopyTextDragAction implements SuperDragAction {
    async execute(options: {
        type: 'text' | 'link' | 'image';
        direction: 'up' | 'right' | 'down' | 'left';
        actionName: string;
        params: Record<string, any>;
    }): Promise<void> {
        Logger.debug('CopyTextDragAction: execute() called', { options });
        const text = options.params.text;
        if (!text) {
            Logger.warn('コピーするテキストが指定されていません', { options });
            return;
        }
        try {
            await navigator.clipboard.writeText(text);
            Logger.debug('テキストをクリップボードにコピーしました', { text });
        } catch (e) {
            Logger.error('テキストのコピーに失敗しました', { error: e, text });
        }
    }
} 