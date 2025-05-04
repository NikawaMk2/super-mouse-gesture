import { DragAction } from './drag_action';
import { DragActionMessagePayload } from '../../../content/services/message/message_types';
import Logger from '../../../common/logger/logger';
import { IDownloadService } from '../download_service_interface';

export class DownloadLinkDragAction implements DragAction {
    private downloadService: IDownloadService;
    constructor(downloadService: IDownloadService) {
        this.downloadService = downloadService;
    }
    async execute(payload: DragActionMessagePayload): Promise<void> {
        Logger.info('DownloadLinkDragAction: execute() が呼び出されました', { payload });
        const url = payload.params.url;
        if (!url) {
            Logger.warn('ダウンロードするリンクURLが指定されていません', { payload });
            return;
        }
        try {
            await this.downloadService.download(url);
        } catch (e: any) {
            Logger.error('リンクのダウンロードに失敗しました', { error: e?.message, url });
        }
    }
} 