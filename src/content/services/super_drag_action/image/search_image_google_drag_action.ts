import { SuperDragAction } from '../super_drag_action';
import Logger from '../../../../common/logger/logger';
import { DragType } from '../../../models/drag_type';
import { Direction } from '../../../models/direction';
import { IDragActionMessageSender } from '../../message/message_sender';

export class SearchImageGoogleDragAction implements SuperDragAction {
    // messageSenderはDIで注入される。テスト時はモックを渡すこと。
    constructor(private messageSender: IDragActionMessageSender) {}
    async execute(options: {
        type: DragType;
        direction: Direction;
        actionName: string;
        params: Record<string, any>;
        selectedValue: string;
    }): Promise<void> {
        Logger.debug('SearchImageGoogleDragAction: execute() called', { options });
        const imageUrl = options.selectedValue;
        const urlTemplate = options.params.url || 'https://www.google.com/searchbyimage?image_url=%s';
        if (!imageUrl) {
            Logger.warn('画像検索する画像URLが指定されていません', { options });
            return;
        }
        const searchUrl = urlTemplate.replace('%s', encodeURIComponent(imageUrl));
        try {
            await this.messageSender.sendDragAction({
                type: options.type,
                direction: options.direction,
                actionName: options.actionName,
                params: { ...options.params, searchUrl },
                selectedValue: imageUrl
            });
            Logger.info('バックグラウンドへGoogle画像検索要求を送信しました', { searchUrl });
        } catch (error) {
            Logger.error('バックグラウンドへのGoogle画像検索要求に失敗しました', { searchUrl, error });
        }
    }
} 