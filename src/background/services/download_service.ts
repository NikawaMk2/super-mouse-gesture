import { IDownloadService } from './download_service_interface';
import Logger from '../../common/logger/logger';

export class DownloadService implements IDownloadService {
    async download(url: string): Promise<void> {
        if (!url) {
            Logger.warn('ダウンロードするURLが指定されていません', { url });
            return;
        }
        try {
            if (chrome.downloads) {
                chrome.downloads.download({ url });
                Logger.debug('リンクのダウンロードを開始しました', { url });
            } else {
                Logger.error('chrome.downloads APIが利用できません', { url });
            }
        } catch (e: any) {
            Logger.error('リンクのダウンロードに失敗しました', { error: e?.message, url });
        }
    }
} 