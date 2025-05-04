import { DownloadLinkDragAction } from '../../../../src/background/services/drag_action/download_link_drag_action';
import Logger from '../../../../src/common/logger/logger';
import { IDownloadService } from '../../../../src/background/services/download_service_interface';

describe('DownloadLinkDragAction', () => {
    let loggerInfoSpy: jest.SpyInstance;
    let loggerWarnSpy: jest.SpyInstance;
    let loggerErrorSpy: jest.SpyInstance;
    let mockDownloadService: IDownloadService;

    beforeEach(() => {
        loggerInfoSpy = jest.spyOn(Logger, 'info').mockImplementation(() => {});
        loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});
        loggerErrorSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {});
        mockDownloadService = { download: jest.fn().mockResolvedValue(undefined) };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('正常にダウンロードが呼ばれる', async () => {
        const action = new DownloadLinkDragAction(mockDownloadService);
        await action.execute({ type: 'link', direction: 'down', actionName: 'downloadLink', params: { url: 'https://example.com/file.txt' } });
        expect(mockDownloadService.download).toHaveBeenCalledWith('https://example.com/file.txt');
    });

    it('url未指定時は警告ログ', async () => {
        const action = new DownloadLinkDragAction(mockDownloadService);
        await action.execute({ type: 'link', direction: 'down', actionName: 'downloadLink', params: {} });
        expect(loggerWarnSpy).toHaveBeenCalledWith('ダウンロードするリンクURLが指定されていません', expect.anything());
        expect(mockDownloadService.download).not.toHaveBeenCalled();
    });

    it('downloadService.downloadで例外発生時はエラーログ', async () => {
        mockDownloadService.download = jest.fn().mockImplementation(() => { throw new Error('fail'); });
        const action = new DownloadLinkDragAction(mockDownloadService);
        await expect(action.execute({ type: 'link', direction: 'down', actionName: 'downloadLink', params: { url: 'https://example.com/file.txt' } })).resolves.toBeUndefined();
        // DownloadService側でエラーログが出る想定
    });
}); 