import { CopyTextDragAction } from '../../../src/content/services/super_drag_action/text/copy_text_drag_action';
import { DragType } from '../../../src/content/models/drag_type';
import { Direction } from '../../../src/content/models/direction';
import Logger from '../../../src/common/logger/logger';
import type { IClipboardService } from '../../../src/content/services/clipboard/clipboard_service_interface';

describe('CopyTextDragAction Integration', () => {
    let action: CopyTextDragAction;
    let clipboardMock: jest.Mocked<IClipboardService>;

    beforeEach(() => {
        jest.clearAllMocks();
        clipboardMock = { writeText: jest.fn() } as any;
        action = new CopyTextDragAction(clipboardMock);
    });

    it('テキストが指定された場合にclipboard.writeTextが呼ばれること', async () => {
        await action.execute({
            type: DragType.TEXT,
            direction: Direction.UP,
            actionName: 'copyText',
            params: {},
            selectedValue: 'test',
        });
        expect(clipboardMock.writeText).toHaveBeenCalledWith('test');
    });

    it('params.textが優先されてclipboard.writeTextが呼ばれること', async () => {
        await action.execute({
            type: DragType.TEXT,
            direction: Direction.UP,
            actionName: 'copyText',
            params: { text: 'paramText' },
            selectedValue: 'test',
        });
        expect(clipboardMock.writeText).toHaveBeenCalledWith('paramText');
    });

    it('テキスト未指定時にLogger.warnが呼ばれること', async () => {
        const warnSpy = jest.spyOn(Logger, 'warn');
        await action.execute({
            type: DragType.TEXT,
            direction: Direction.UP,
            actionName: 'copyText',
            params: {},
            selectedValue: '',
        });
        expect(warnSpy).toHaveBeenCalledWith(
            'コピーするテキストが指定されていません',
            expect.objectContaining({ options: expect.any(Object) })
        );
        warnSpy.mockRestore();
    });

    it('クリップボード書き込み失敗時にLogger.errorが呼ばれること', async () => {
        const errorSpy = jest.spyOn(Logger, 'error');
        clipboardMock.writeText.mockImplementation(() => { throw new Error('clipboard error'); });
        await action.execute({
            type: DragType.TEXT,
            direction: Direction.UP,
            actionName: 'copyText',
            params: {},
            selectedValue: 'test',
        });
        expect(errorSpy).toHaveBeenCalledWith(
            'テキストのコピーに失敗しました',
            expect.objectContaining({ error: expect.any(Error), text: 'test' })
        );
        errorSpy.mockRestore();
    });
}); 