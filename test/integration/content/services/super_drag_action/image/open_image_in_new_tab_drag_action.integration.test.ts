import { OpenImageInNewTabDragAction } from '../../../../../../src/content/services/super_drag_action/image/open_image_in_new_tab_drag_action';
import Logger from '../../../../../../src/common/logger/logger';
import type { IDragActionMessageSender } from '../../../../../../src/content/services/message/message_sender';
import { DragType } from '../../../../../../src/content/models/drag_type';
import { Direction } from '../../../../../../src/content/models/direction';

// Loggerをモック
jest.mock('../../../../../../src/common/logger/logger');

describe('OpenImageInNewTabDragAction (integration)', () => {
    let messageSenderMock: jest.Mocked<IDragActionMessageSender>;
    let action: OpenImageInNewTabDragAction;

    beforeEach(() => {
        messageSenderMock = { sendDragAction: jest.fn() };
        action = new OpenImageInNewTabDragAction(messageSenderMock);
        (Logger.debug as jest.Mock).mockClear();
        (Logger.warn as jest.Mock).mockClear();
        (Logger.info as jest.Mock).mockClear();
        (Logger.error as jest.Mock).mockClear();
    });

    it('正常系: 画像URLが指定された場合にメッセージ送信後、バックグラウンドでOpenImageInNewTabDragActionが実行されること', async () => {
        await action.execute({
            type: DragType.IMAGE,
            direction: Direction.UP,
            actionName: 'openImageInNewTab',
            params: {},
            selectedValue: 'https://example.com/image.png',
        });
        expect(messageSenderMock.sendDragAction).toHaveBeenCalledWith({
            type: DragType.IMAGE,
            direction: Direction.UP,
            actionName: 'openImageInNewTab',
            params: {},
            selectedValue: 'https://example.com/image.png',
        });
        expect(Logger.debug).toHaveBeenCalled();
        expect(Logger.info).toHaveBeenCalledWith('バックグラウンドへ画像新規タブ開要求を送信しました', { url: 'https://example.com/image.png' });
    });

    it('異常系: 画像URL未指定時に警告ログが出ること', async () => {
        await action.execute({
            type: DragType.IMAGE,
            direction: Direction.UP,
            actionName: 'openImageInNewTab',
            params: {},
            selectedValue: '',
        });
        expect(messageSenderMock.sendDragAction).not.toHaveBeenCalled();
        expect(Logger.warn).toHaveBeenCalledWith('開く画像URLが指定されていません', expect.any(Object));
    });

    it('異常系: メッセージ送信失敗時にエラーログが出ること', async () => {
        messageSenderMock.sendDragAction.mockRejectedValueOnce(new Error('send failed'));
        await action.execute({
            type: DragType.IMAGE,
            direction: Direction.UP,
            actionName: 'openImageInNewTab',
            params: {},
            selectedValue: 'https://example.com/image.png',
        });
        expect(Logger.error).toHaveBeenCalledWith('バックグラウンドへの画像新規タブ開要求に失敗しました', { url: 'https://example.com/image.png', error: expect.any(Error) });
    });
}); 