import { DragAction } from './drag_action';
import { DragActionMessagePayload } from '../../../content/services/message/message_types';
import Logger from '../../../common/logger/logger';
import { IClipboardService } from '../clipboard/clipboard_service_interface';

export class CopyImageUrlDragAction implements DragAction {
    private clipboardService: IClipboardService;
    constructor(clipboardService: IClipboardService) {
        this.clipboardService = clipboardService;
    }
    async execute(payload: DragActionMessagePayload): Promise<void> {
        Logger.debug('CopyImageUrlDragAction: execute() が呼び出されました', { payload });
        const url = payload.params.url;
        if (!url) {
            Logger.warn('コピーする画像URLが指定されていません', { payload });
            return;
        }
        try {
            await this.clipboardService.writeText(url);
            Logger.debug('画像URLをクリップボードにコピーしました', { url });
        } catch (e: any) {
            Logger.error('画像URLのコピーに失敗しました', { error: e?.message, url });
        }
    }
} 