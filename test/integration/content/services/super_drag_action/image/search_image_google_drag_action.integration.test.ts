import { SearchImageGoogleDragAction } from '../../../../../../src/content/services/super_drag_action/image/search_image_google_drag_action';
import Logger from '../../../../../../src/common/logger/logger';
import type { IDragActionMessageSender } from '../../../../../../src/content/services/message/message_sender';
import { DragType } from '../../../../../../src/content/models/drag_type';
import { Direction } from '../../../../../../src/content/models/direction';

// Loggerをモック
jest.mock('../../../../../../src/common/logger/logger');

describe('SearchImageGoogleDragAction (integration)', () => {
    let messageSenderMock: jest.Mocked<IDragActionMessageSender>;
    let action: SearchImageGoogleDragAction;

    beforeEach(() => {
        messageSenderMock = { sendDragAction: jest.fn() };
        action = new SearchImageGoogleDragAction(messageSenderMock);
        (Logger.debug as jest.Mock).mockClear();
        (Logger.warn as jest.Mock).mockClear();
        (Logger.info as jest.Mock).mockClear();
        (Logger.error as jest.Mock).mockClear();
    });

    it('正常系: 画像URLが指定された場合にメッセージ送信後、バックグラウンドでSearchImageGoogleDragActionが実行されること', async () => {
        await action.execute({
            type: DragType.IMAGE,
            direction: Direction.RIGHT,
            actionName: 'searchImageGoogle',
            params: {},
            selectedValue: 'https://example.com/image.png',
        });
        expect(messageSenderMock.sendDragAction).toHaveBeenCalledWith(expect.objectContaining({
            type: DragType.IMAGE,
            direction: Direction.RIGHT,
            actionName: 'searchImageGoogle',
            selectedValue: 'https://example.com/image.png',
            params: expect.objectContaining({ searchUrl: expect.stringContaining('https://www.google.com/searchbyimage?image_url=') })
        }));
        expect(Logger.debug).toHaveBeenCalled();
        expect(Logger.info).toHaveBeenCalledWith('バックグラウンドへGoogle画像検索要求を送信しました', expect.objectContaining({ searchUrl: expect.any(String) }));
    });

    it('異常系: 画像URL未指定時に警告ログが出ること', async () => {
        await action.execute({
            type: DragType.IMAGE,
            direction: Direction.RIGHT,
            actionName: 'searchImageGoogle',
            params: {},
            selectedValue: '',
        });
        expect(messageSenderMock.sendDragAction).not.toHaveBeenCalled();
        expect(Logger.warn).toHaveBeenCalledWith('画像検索する画像URLが指定されていません', expect.any(Object));
    });

    it('異常系: メッセージ送信失敗時にエラーログが出ること', async () => {
        messageSenderMock.sendDragAction.mockRejectedValueOnce(new Error('send failed'));
        await action.execute({
            type: DragType.IMAGE,
            direction: Direction.RIGHT,
            actionName: 'searchImageGoogle',
            params: {},
            selectedValue: 'https://example.com/image.png',
        });
        expect(Logger.error).toHaveBeenCalledWith('バックグラウンドへのGoogle画像検索要求に失敗しました', expect.objectContaining({ error: expect.any(Error), searchUrl: expect.any(String) }));
    });
}); 