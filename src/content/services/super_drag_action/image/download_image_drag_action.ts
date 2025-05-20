import { SuperDragAction } from '../super_drag_action';
import Logger from '../../../../common/logger/logger';
import { ChromeMessageSender, IDragActionMessageSender } from '../../message/message_sender';
import { DragType } from '../../../models/drag_type';
import { Direction } from '../../../models/direction';

export class DownloadImageDragAction implements SuperDragAction {
    private sender: IDragActionMessageSender;
    constructor(sender: IDragActionMessageSender = new ChromeMessageSender()) {
        this.sender = sender;
    }
    async execute(options: {
        type: DragType;
        direction: Direction;
        actionName: string;
        params: Record<string, any>;
        selectedValue: string;
    }): Promise<void> {
        Logger.debug('DownloadImageDragAction: execute() called', { options });
        const url = options.selectedValue;
        if (!url) {
            Logger.warn('ダウンロードする画像URLが指定されていません', { options });
            return;
        }
        await this.sender.sendDragAction({
            ...options,
            type: DragType.IMAGE,
            direction: options.direction,
            openType: 'downloadImage'
        });
    }
} 