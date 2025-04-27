import { SuperDragAction } from '../super_drag_action';
import Logger from '../../../../common/logger/logger';

export class OpenAsUrlDragAction implements SuperDragAction {
    async execute(options: {
        type: 'text' | 'link' | 'image';
        direction: 'up' | 'right' | 'down' | 'left';
        actionName: string;
        params: Record<string, any>;
    }): Promise<void> {
        Logger.debug('OpenAsUrlDragAction: execute() called', { options });
        const text = options.params.text;
        const newTab = options.params.newTab ?? true;
        if (!text) {
            Logger.warn('URLとして開くテキストが指定されていません', { options });
            return;
        }
        let url = text.trim();
        if (!/^https?:\/\//.test(url)) {
            url = 'http://' + url;
        }
        if (newTab) {
            window.open(url, '_blank');
        } else {
            window.location.href = url;
        }
    }
} 