import { DragAction } from './drag_action';
import { DragActionMessagePayload } from '../../../content/services/message/message_types';
import Logger from '../../../common/logger/logger';
import type { IDownloadService } from '../download_service_interface';
import { inject } from 'inversify';

export class DownloadImageDragAction implements DragAction {
    private downloadService: IDownloadService;
    constructor(@inject('IDownloadService') downloadService: IDownloadService) {
        this.downloadService = downloadService;
    }
    async execute(payload: DragActionMessagePayload): Promise<void> {
        Logger.debug('DownloadImageDragAction: execute() が呼び出されました', { payload });
        const url = payload.selectedValue;
        if (!url) {
            Logger.warn('ダウンロードする画像URLが指定されていません', { payload });
            return;
        }
        try {
            await this.downloadService.download(url);
            Logger.debug('画像をダウンロードしました', { url });
        } catch (e: any) {
            Logger.error('画像のダウンロードに失敗しました', { error: e?.message, url });
        }
    }
} 