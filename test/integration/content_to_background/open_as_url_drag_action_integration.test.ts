import { OpenAsUrlDragAction } from '../../../src/content/services/super_drag_action/text/open_as_url_drag_action';
import { DragType } from '../../../src/content/models/drag_type';
import { Direction } from '../../../src/content/models/direction';
import Logger from '../../../src/common/logger/logger';
import { IDragActionMessageSender } from '../../../src/content/services/message/message_sender';

describe('OpenAsUrlDragAction Integration', () => {
    let action: OpenAsUrlDragAction;
    let senderMock: jest.Mocked<IDragActionMessageSender>;

    beforeEach(() => {
        jest.clearAllMocks();
        senderMock = { sendDragAction: jest.fn() } as any;
        action = new OpenAsUrlDragAction(senderMock);
    });

    it('テキストが指定された場合にsendDragActionが呼ばれること（newTab=true）', async () => {
        await action.execute({
            type: DragType.TEXT,
            direction: Direction.UP,
            actionName: 'openAsUrl',
            params: { newTab: true },
            selectedValue: 'example.com',
        });
        expect(senderMock.sendDragAction).toHaveBeenCalledWith(expect.objectContaining({
            params: expect.objectContaining({ url: expect.stringContaining('example.com'), newTab: true })
        }));
    });

    it('テキストが指定された場合にsendDragActionが呼ばれること（newTab=false）', async () => {
        await action.execute({
            type: DragType.TEXT,
            direction: Direction.UP,
            actionName: 'openAsUrl',
            params: { newTab: false },
            selectedValue: 'example.com',
        });
        expect(senderMock.sendDragAction).toHaveBeenCalledWith(expect.objectContaining({
            params: expect.objectContaining({ url: expect.stringContaining('example.com'), newTab: false })
        }));
    });

    it('テキスト未指定時にLogger.warnが呼ばれること', async () => {
        const warnSpy = jest.spyOn(Logger, 'warn');
        await action.execute({
            type: DragType.TEXT,
            direction: Direction.UP,
            actionName: 'openAsUrl',
            params: {},
            selectedValue: '',
        });
        expect(warnSpy).toHaveBeenCalledWith(
            'URLとして開くテキストが指定されていません',
            expect.objectContaining({ options: expect.any(Object) })
        );
        warnSpy.mockRestore();
    });

    it('メッセージ送信失敗時にLogger.errorが呼ばれること', async () => {
        const errorSpy = jest.spyOn(Logger, 'error');
        senderMock.sendDragAction.mockImplementation(() => { throw new Error('send error'); });
        await action.execute({
            type: DragType.TEXT,
            direction: Direction.UP,
            actionName: 'openAsUrl',
            params: {},
            selectedValue: 'example.com',
        });
        expect(errorSpy).toHaveBeenCalledWith(
            'バックグラウンドへのURL開要求に失敗しました',
            expect.objectContaining({ error: expect.any(Error) })
        );
        errorSpy.mockRestore();
    });
}); 