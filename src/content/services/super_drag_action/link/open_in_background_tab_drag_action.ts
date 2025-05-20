import { SuperDragAction } from '../super_drag_action';
import Logger from '../../../../common/logger/logger';
import { ChromeMessageSender, IDragActionMessageSender } from '../../message/message_sender';
import { DragType } from '../../../models/drag_type';
import { Direction } from '../../../models/direction';

export class OpenInBackgroundTabDragAction implements SuperDragAction {
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
        Logger.debug('OpenInBackgroundTabDragAction: execute() called', { options });
        const url = options.selectedValue;
        if (!url) {
            Logger.warn('開くリンクURLが指定されていません', { options });
            return;
        }
        await this.sender.sendDragAction({
            ...options,
            type: options.type,
            direction: options.direction,
            openType: 'background'
        });
    }
} 