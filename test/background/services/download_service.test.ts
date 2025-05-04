import { DownloadService } from '../../../src/background/services/download_service';
import Logger from '../../../src/common/logger/logger';

describe('DownloadService', () => {
    let loggerInfoSpy: jest.SpyInstance;
    let loggerWarnSpy: jest.SpyInstance;
    let loggerErrorSpy: jest.SpyInstance;
    let originalChrome: any;

    beforeEach(() => {
        loggerInfoSpy = jest.spyOn(Logger, 'info').mockImplementation(() => {});
        loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});
        loggerErrorSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {});
        originalChrome = global.chrome;
        global.chrome = { downloads: { download: jest.fn() } } as any;
    });

    afterEach(() => {
        jest.restoreAllMocks();
        global.chrome = originalChrome;
    });

    it('正常にダウンロードが呼ばれる', async () => {
        const service = new DownloadService();
        await service.download('https://example.com/file.txt');
        expect(global.chrome.downloads.download).toHaveBeenCalledWith({ url: 'https://example.com/file.txt' });
        expect(loggerInfoSpy).toHaveBeenCalledWith('リンクのダウンロードを開始しました', { url: 'https://example.com/file.txt' });
    });

    it('url未指定時は警告ログ', async () => {
        const service = new DownloadService();
        await service.download('');
        expect(loggerWarnSpy).toHaveBeenCalledWith('ダウンロードするURLが指定されていません', { url: '' });
        expect(global.chrome.downloads.download).not.toHaveBeenCalled();
    });

    it('chrome.downloads未定義時はエラーログ', async () => {
        global.chrome = {} as any;
        const service = new DownloadService();
        await service.download('https://example.com/file.txt');
        expect(loggerErrorSpy).toHaveBeenCalledWith('chrome.downloads APIが利用できません', { url: 'https://example.com/file.txt' });
    });

    it('chrome.downloads.downloadで例外発生時はエラーログ', async () => {
        (global.chrome.downloads.download as jest.Mock).mockImplementation(() => { throw new Error('fail'); });
        const service = new DownloadService();
        await service.download('https://example.com/file.txt');
        expect(loggerErrorSpy).toHaveBeenCalledWith('リンクのダウンロードに失敗しました', expect.objectContaining({ error: 'fail' }));
    });
}); 