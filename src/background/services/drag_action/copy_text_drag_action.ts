import { DragActionMessagePayload } from '../../../content/services/message/message_types';
import Logger from '../../../common/logger/logger';
import { DragAction } from './drag_action';
import type { IClipboardService } from '../clipboard/clipboard_service_interface';
import { inject } from 'inversify';

export class CopyTextDragAction implements DragAction {
    constructor(@inject('IClipboardService') private clipboardService: IClipboardService) {}
    async execute(payload: DragActionMessagePayload): Promise<void> {
        Logger.debug('CopyTextDragAction: execute() が呼び出されました', { payload });
        const text = payload.params.text;
        if (!text) {
            Logger.warn('コピーするテキストが指定されていません', { payload });
            return;
        }
        try {
            await this.clipboardService.writeText(text);
            Logger.debug('テキストをクリップボードにコピーしました', { text });
        } catch (e) {
            Logger.error('テキストのコピーに失敗しました', { error: e, text });
        }
    }
} 