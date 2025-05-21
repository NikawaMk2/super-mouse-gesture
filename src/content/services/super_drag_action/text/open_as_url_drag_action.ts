import { SuperDragAction } from '../super_drag_action';
import Logger from '../../../../common/logger/logger';
import { DragType } from '../../../models/drag_type';
import { Direction } from '../../../models/direction';
import { IDragActionMessageSender } from '../../message/message_sender';

export class OpenAsUrlDragAction implements SuperDragAction {
    // messageSenderはDIで注入される。テスト時はモックを渡すこと。
    constructor(private messageSender: IDragActionMessageSender) {}

    async execute(options: {
        type: DragType;
        direction: Direction;
        actionName: string;
        params: Record<string, any>;
        selectedValue: string;
    }): Promise<void> {
        Logger.debug('OpenAsUrlDragAction: execute() called', { options });
        const text = options.selectedValue;
        const newTab = options.params.newTab ?? true;
        if (!text) {
            Logger.warn('URLとして開くテキストが指定されていません', { options });
            return;
        }
        let url = text.trim();
        if (!/^https?:\/\//.test(url)) {
            url = 'http://' + url;
        }
        try {
            await this.messageSender.sendDragAction({
                type: options.type,
                direction: options.direction,
                actionName: options.actionName,
                params: { ...options.params, url, newTab },
                selectedValue: text
            });
            Logger.info('バックグラウンドへURL開要求を送信しました', { url, newTab });
        } catch (error) {
            Logger.error('バックグラウンドへのURL開要求に失敗しました', { url, newTab, error });
        }
    }
} 