import { SuperDragAction } from '../super_drag_action';
import Logger from '../../../../common/logger/logger';
import { DragType } from '../../../models/drag_type';
import { Direction } from '../../../models/direction';
import { IDragActionMessageSender } from '../../message/message_sender';

export class SearchBingDragAction implements SuperDragAction {
    // messageSenderはDIで注入される。テスト時はモックを渡すこと。
    constructor(private messageSender: IDragActionMessageSender) {}

    async execute(options: {
        type: DragType;
        direction: Direction;
        actionName: string;
        params: Record<string, any>;
        selectedValue: string;
    }): Promise<void> {
        Logger.debug('SearchBingDragAction: execute() called', { options });
        const text = options.selectedValue;
        const urlTemplate = options.params.url || 'https://www.bing.com/search?q=%s';
        if (!text) {
            Logger.warn('検索テキストが指定されていません', { options });
            return;
        }
        const searchUrl = urlTemplate.replace('%s', encodeURIComponent(text));
        try {
            await this.messageSender.sendDragAction({
                type: options.type,
                direction: options.direction,
                actionName: options.actionName,
                params: { ...options.params, searchUrl },
                selectedValue: text
            });
            Logger.info('バックグラウンドへBing検索要求を送信しました', { searchUrl });
        } catch (error) {
            Logger.error('バックグラウンドへのBing検索要求に失敗しました', { searchUrl, error });
        }
    }
} 