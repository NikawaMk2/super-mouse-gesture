import { CopyLinkUrlDragAction } from '../../../../src/background/services/drag_action/copy_link_url_drag_action';
import Logger from '../../../../src/common/logger/logger';

describe('CopyLinkUrlDragAction', () => {
    let clipboardWriteTextSpy: jest.SpyInstance;
    let loggerDebugSpy: jest.SpyInstance;
    let loggerWarnSpy: jest.SpyInstance;
    let loggerErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        (global.navigator as any).clipboard = { writeText: jest.fn() };
        clipboardWriteTextSpy = jest.spyOn(navigator.clipboard, 'writeText');
        loggerDebugSpy = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});
        loggerErrorSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('正常にクリップボードへコピーされる', async () => {
        const action = new CopyLinkUrlDragAction();
        await action.execute({ type: 'link', direction: 'down', actionName: 'copyLinkUrl', params: { url: 'https://example.com/' } });
        expect(clipboardWriteTextSpy).toHaveBeenCalledWith('https://example.com/');
        expect(loggerDebugSpy).toHaveBeenCalledWith('リンクURLをクリップボードにコピーしました', { url: 'https://example.com/' });
    });

    it('url未指定時は警告ログ', async () => {
        const action = new CopyLinkUrlDragAction();
        await action.execute({ type: 'link', direction: 'down', actionName: 'copyLinkUrl', params: {} });
        expect(loggerWarnSpy).toHaveBeenCalledWith('コピーするリンクURLが指定されていません', expect.anything());
    });

    it('例外発生時はエラーログ', async () => {
        clipboardWriteTextSpy.mockImplementation(() => { throw new Error('fail'); });
        const action = new CopyLinkUrlDragAction();
        await action.execute({ type: 'link', direction: 'down', actionName: 'copyLinkUrl', params: { url: 'https://example.com/' } });
        expect(loggerErrorSpy).toHaveBeenCalledWith('リンクURLのコピーに失敗しました', expect.objectContaining({ error: 'fail' }));
    });
}); 