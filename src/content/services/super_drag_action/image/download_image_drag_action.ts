import { SuperDragAction } from '../super_drag_action';
import Logger from '../../../../common/logger/logger';
import { ChromeMessageSender } from '../../message/message_sender';

export class DownloadImageDragAction implements SuperDragAction {
    async execute(options: {
        type: 'text' | 'link' | 'image';
        direction: 'up' | 'right' | 'down' | 'left';
        actionName: string;
        params: Record<string, any>;
    }): Promise<void> {
        Logger.debug('DownloadImageDragAction: execute() called', { options });
        const url = options.params.url;
        if (!url) {
            Logger.warn('ダウンロードする画像URLが指定されていません', { options });
            return;
        }
        const sender = new ChromeMessageSender();
        await sender.sendDragAction({
            ...options,
            openType: 'downloadImage'
        });
    }
} 