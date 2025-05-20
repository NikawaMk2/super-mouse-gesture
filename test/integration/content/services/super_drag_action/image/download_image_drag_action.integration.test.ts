import { DownloadImageDragAction } from '../../../../../../src/content/services/super_drag_action/image/download_image_drag_action';
import Logger from '../../../../../../src/common/logger/logger';
import { IDragActionMessageSender } from '../../../../../../src/content/services/message/message_sender';
import { DragType } from '../../../../../../src/content/models/drag_type';
import { Direction } from '../../../../../../src/content/models/direction';

// Loggerをモック
jest.mock('../../../../../../src/common/logger/logger');

describe('DownloadImageDragAction (integration)', () => {
    let messageSenderMock: jest.Mocked<IDragActionMessageSender>;
    beforeEach(() => {
        messageSenderMock = { sendDragAction: jest.fn() };
        (Logger.debug as jest.Mock).mockClear();
        (Logger.warn as jest.Mock).mockClear();
    });

    it('正常系: 画像URLが指定された場合にメッセージ送信後、バックグラウンドでDownloadImageDragActionが実行されること', async () => {
        const action = new DownloadImageDragAction(messageSenderMock);
        await action.execute({
            type: DragType.IMAGE,
            direction: Direction.DOWN,
            actionName: 'downloadImage',
            params: {},
            selectedValue: 'https://example.com/image.png',
        });
        expect(messageSenderMock.sendDragAction).toHaveBeenCalledWith(expect.objectContaining({
            type: DragType.IMAGE,
            direction: Direction.DOWN,
            actionName: 'downloadImage',
            selectedValue: 'https://example.com/image.png',
            openType: 'downloadImage',
        }));
        expect(Logger.debug).toHaveBeenCalled();
    });

    it('異常系: 画像URL未指定時に警告ログが出ること', async () => {
        const action = new DownloadImageDragAction(messageSenderMock);
        await action.execute({
            type: DragType.IMAGE,
            direction: Direction.DOWN,
            actionName: 'downloadImage',
            params: {},
            selectedValue: '',
        });
        expect(messageSenderMock.sendDragAction).not.toHaveBeenCalled();
        expect(Logger.warn).toHaveBeenCalledWith('ダウンロードする画像URLが指定されていません', expect.any(Object));
    });
}); 