import { SearchGoogleDragAction } from '../../../src/content/services/super_drag_action/text/search_google_drag_action';
import { DragType } from '../../../src/content/models/drag_type';
import { Direction } from '../../../src/content/models/direction';
import Logger from '../../../src/common/logger/logger';
import { IDragActionMessageSender } from '../../../src/content/services/message/message_sender';

describe('SearchGoogleDragAction Integration', () => {
    let action: SearchGoogleDragAction;
    let senderMock: jest.Mocked<IDragActionMessageSender>;

    beforeEach(() => {
        jest.clearAllMocks();
        senderMock = { sendDragAction: jest.fn() } as any;
        action = new SearchGoogleDragAction(senderMock);
    });

    it('テキストが指定された場合にsendDragActionが呼ばれること', async () => {
        await action.execute({
            type: DragType.TEXT,
            direction: Direction.UP,
            actionName: 'searchGoogle',
            params: { url: 'https://www.google.com/search?q=%s' },
            selectedValue: 'test',
        });
        expect(senderMock.sendDragAction).toHaveBeenCalledWith(expect.objectContaining({
            params: expect.objectContaining({ searchUrl: expect.stringContaining('test') })
        }));
    });

    it('テキスト未指定時にLogger.warnが呼ばれること', async () => {
        const warnSpy = jest.spyOn(Logger, 'warn');
        await action.execute({
            type: DragType.TEXT,
            direction: Direction.UP,
            actionName: 'searchGoogle',
            params: {},
            selectedValue: '',
        });
        expect(warnSpy).toHaveBeenCalledWith(
            '検索テキストが指定されていません',
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
            actionName: 'searchGoogle',
            params: {},
            selectedValue: 'test',
        });
        expect(errorSpy).toHaveBeenCalledWith(
            'バックグラウンドへのGoogle検索要求に失敗しました',
            expect.objectContaining({ error: expect.any(Error) })
        );
        errorSpy.mockRestore();
    });
}); 