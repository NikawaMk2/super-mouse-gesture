import { DragAction } from './drag_action';
import { DragActionMessagePayload } from '../../../content/services/message/message_types';
import Logger from '../../../common/logger/logger';

export class CopyLinkUrlDragAction implements DragAction {
    async execute(payload: DragActionMessagePayload): Promise<void> {
        Logger.debug('CopyLinkUrlDragAction: execute() が呼び出されました', { payload });
        const url = payload.params.url;
        if (!url) {
            Logger.warn('コピーするリンクURLが指定されていません', { payload });
            return;
        }
        try {
            await navigator.clipboard.writeText(url);
            Logger.debug('リンクURLをクリップボードにコピーしました', { url });
        } catch (e: any) {
            Logger.error('リンクURLのコピーに失敗しました', { error: e?.message, url });
        }
    }
} 