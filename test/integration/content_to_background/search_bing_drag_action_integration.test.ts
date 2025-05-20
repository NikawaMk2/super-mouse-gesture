import { SearchBingDragAction } from '../../../src/content/services/super_drag_action/text/search_bing_drag_action';
import { DragType } from '../../../src/content/models/drag_type';
import { Direction } from '../../../src/content/models/direction';
import Logger from '../../../src/common/logger/logger';
import { IDragActionMessageSender } from '../../../src/content/services/message/message_sender';

describe('SearchBingDragAction Integration', () => {
    let action: SearchBingDragAction;
    let senderMock: jest.Mocked<IDragActionMessageSender>;

    beforeEach(() => {
        jest.clearAllMocks();
        senderMock = { sendDragAction: jest.fn() } as any;
        action = new SearchBingDragAction(senderMock);
    });

    it('テキストが指定された場合にsendDragActionが呼ばれること', async () => {
        await action.execute({
            type: DragType.TEXT,
            direction: Direction.UP,
            actionName: 'searchBing',
            params: { url: 'https://www.bing.com/search?q=%s' },
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
            actionName: 'searchBing',
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
            actionName: 'searchBing',
            params: {},
            selectedValue: 'test',
        });
        expect(errorSpy).toHaveBeenCalledWith(
            'バックグラウンドへのBing検索要求に失敗しました',
            expect.objectContaining({ error: expect.any(Error) })
        );
        errorSpy.mockRestore();
    });
}); 