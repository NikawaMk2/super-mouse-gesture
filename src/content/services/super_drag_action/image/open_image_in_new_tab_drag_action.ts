import { SuperDragAction } from '../super_drag_action';
import Logger from '../../../../common/logger/logger';
import { DragType } from '../../../models/drag_type';
import { Direction } from '../../../models/direction';
import { IDragActionMessageSender } from '../../message/message_sender';

export class OpenImageInNewTabDragAction implements SuperDragAction {
    // messageSenderはDIで注入される。テスト時はモックを渡すこと。
    constructor(private messageSender: IDragActionMessageSender) {}
    async execute(options: {
        type: DragType;
        direction: Direction;
        actionName: string;
        params: Record<string, any>;
        selectedValue: string;
    }): Promise<void> {
        Logger.debug('OpenImageInNewTabDragAction: execute() called', { options });
        const url = options.selectedValue;
        if (!url) {
            Logger.warn('開く画像URLが指定されていません', { options });
            return;
        }
        try {
            await this.messageSender.sendDragAction({
                type: options.type,
                direction: options.direction,
                actionName: options.actionName,
                params: options.params,
                selectedValue: url
            });
            Logger.info('バックグラウンドへ画像新規タブ開要求を送信しました', { url });
        } catch (error) {
            Logger.error('バックグラウンドへの画像新規タブ開要求に失敗しました', { url, error });
        }
    }
} 