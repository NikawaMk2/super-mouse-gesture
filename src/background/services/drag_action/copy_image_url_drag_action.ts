import { DragAction } from './drag_action';
import { DragActionMessagePayload } from '../../../content/services/message/message_types';
import Logger from '../../../common/logger/logger';
import type { IClipboardService } from '../clipboard/clipboard_service_interface';
import { inject } from 'inversify';

export class CopyImageUrlDragAction implements DragAction {
    private clipboardService: IClipboardService;
    constructor(@inject('IClipboardService') clipboardService: IClipboardService) {
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