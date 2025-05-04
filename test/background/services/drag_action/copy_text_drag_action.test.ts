import { CopyTextDragAction } from '../../../../src/background/services/drag_action/copy_text_drag_action';
import Logger from '../../../../src/common/logger/logger';
import { IClipboardService } from '../../../../src/background/services/clipboard/clipboard_service_interface';

describe('CopyTextDragAction', () => {
    let clipboardWriteTextSpy: jest.Mock;
    let loggerDebugSpy: jest.SpyInstance;
    let loggerWarnSpy: jest.SpyInstance;
    let loggerErrorSpy: jest.SpyInstance;
    let clipboardServiceMock: IClipboardService;

    beforeEach(() => {
        clipboardWriteTextSpy = jest.fn();
        clipboardServiceMock = { writeText: clipboardWriteTextSpy };
        loggerDebugSpy = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});
        loggerErrorSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('正常にテキストがクリップボードへコピーされる', async () => {
        const action = new CopyTextDragAction(clipboardServiceMock);
        const payload = {
            type: 'text' as const,
            direction: 'up' as const,
            actionName: 'copyText' as const,
            params: { text: 'テストコピー' }
        };
        await action.execute(payload);
        expect(clipboardWriteTextSpy).toHaveBeenCalledWith('テストコピー');
        expect(loggerDebugSpy).toHaveBeenCalledWith('CopyTextDragAction: execute() が呼び出されました', { payload });
        expect(loggerDebugSpy).toHaveBeenCalledWith('テキストをクリップボードにコピーしました', { text: 'テストコピー' });
    });

    it('text未指定時は警告ログが出る', async () => {
        const action = new CopyTextDragAction(clipboardServiceMock);
        const payload = {
            type: 'text' as const,
            direction: 'up' as const,
            actionName: 'copyText' as const,
            params: {}
        };
        await action.execute(payload);
        expect(clipboardWriteTextSpy).not.toHaveBeenCalled();
        expect(loggerWarnSpy).toHaveBeenCalledWith('コピーするテキストが指定されていません', { payload });
    });

    it('clipboard.writeTextで例外発生時はエラーログが出る', async () => {
        clipboardWriteTextSpy.mockImplementation(() => { throw new Error('fail'); });
        const action = new CopyTextDragAction(clipboardServiceMock);
        const payload = {
            type: 'text' as const,
            direction: 'up' as const,
            actionName: 'copyText' as const,
            params: { text: '例外テスト' }
        };
        await action.execute(payload);
        expect(loggerErrorSpy).toHaveBeenCalledWith('テキストのコピーに失敗しました', expect.objectContaining({ error: expect.any(Error), text: '例外テスト' }));
    });
}); 