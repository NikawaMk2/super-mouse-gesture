import { SuperDragAction } from '../super_drag_action';
import Logger from '../../../../common/logger/logger';
import { ChromeMessageSender } from '../../message/message_sender';
import { DragType } from '../../../models/drag_type';
import { Direction } from '../../../models/direction';

export class OpenInBackgroundTabDragAction implements SuperDragAction {
    async execute(options: {
        type: DragType;
        direction: Direction;
        actionName: string;
        params: Record<string, any>;
        selectedValue: string;
    }): Promise<void> {
        Logger.debug('OpenInBackgroundTabDragAction: execute() called', { options });
        const url = options.params.url;
        if (!url) {
            Logger.warn('開くリンクURLが指定されていません', { options });
            return;
        }
        const sender = new ChromeMessageSender();
        const type = options.type !== DragType.NONE ? options.type : DragType.TEXT;
        const direction = options.direction !== Direction.NONE ? options.direction : Direction.UP;
        await sender.sendDragAction({
            ...options,
            type,
            direction,
            openType: 'background'
        });
    }
} 