import { CopyImageUrlDragAction } from '../../../../src/background/services/drag_action/copy_image_url_drag_action';
import Logger from '../../../../src/common/logger/logger';
import { IClipboardService } from '../../../../src/background/services/clipboard/clipboard_service_interface';

describe('CopyImageUrlDragAction', () => {
    let clipboardServiceMock: IClipboardService;
    let loggerDebugSpy: jest.SpyInstance;
    let loggerWarnSpy: jest.SpyInstance;
    let loggerErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        clipboardServiceMock = { writeText: jest.fn() };
        loggerDebugSpy = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});
        loggerErrorSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('正常にクリップボードへコピーされる', async () => {
        const action = new CopyImageUrlDragAction(clipboardServiceMock);
        await action.execute({ type: 'image', direction: 'down', actionName: 'copyImageUrl', params: { url: 'https://example.com/image.png' } });
        expect(clipboardServiceMock.writeText).toHaveBeenCalledWith('https://example.com/image.png');
        expect(loggerDebugSpy).toHaveBeenCalledWith('画像URLをクリップボードにコピーしました', { url: 'https://example.com/image.png' });
    });

    it('url未指定時は警告ログ', async () => {
        const action = new CopyImageUrlDragAction(clipboardServiceMock);
        await action.execute({ type: 'image', direction: 'down', actionName: 'copyImageUrl', params: {} });
        expect(loggerWarnSpy).toHaveBeenCalledWith('コピーする画像URLが指定されていません', expect.anything());
    });

    it('例外発生時はエラーログ', async () => {
        (clipboardServiceMock.writeText as jest.Mock).mockImplementation(() => { throw new Error('fail'); });
        const action = new CopyImageUrlDragAction(clipboardServiceMock);
        await action.execute({ type: 'image', direction: 'down', actionName: 'copyImageUrl', params: { url: 'https://example.com/image.png' } });
        expect(loggerErrorSpy).toHaveBeenCalledWith('画像URLのコピーに失敗しました', expect.objectContaining({ error: 'fail' }));
    });
}); 