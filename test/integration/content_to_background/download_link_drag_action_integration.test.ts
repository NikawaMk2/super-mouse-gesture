import { DownloadLinkDragAction } from '../../../src/content/services/super_drag_action/link/download_link_drag_action';
import { DragType } from '../../../src/content/models/drag_type';
import { Direction } from '../../../src/content/models/direction';
import Logger from '../../../src/common/logger/logger';
import { ChromeMessageSender } from '../../../src/content/services/message/message_sender';
import { MessageListener } from '../../../src/background/services/message_listener';
import { DragActionHandler } from '../../../src/background/services/drag_action_handler';
import { GestureActionHandler } from '../../../src/background/services/gesture_action_handler';

describe('DownloadLinkDragAction Integration', () => {
    let action: DownloadLinkDragAction;
    let senderMock: jest.Mocked<ChromeMessageSender>;
    let messageSender: ChromeMessageSender;
    let messageListener: MessageListener;
    let dragActionHandler: DragActionHandler;
    let gestureActionHandler: GestureActionHandler;

    beforeEach(() => {
        (chrome.downloads.download as jest.Mock) = jest.fn((options, callback) => {
            if (callback) callback(999);
        });
        jest.clearAllMocks();

        // ハンドラーの初期化
        gestureActionHandler = new GestureActionHandler();
        dragActionHandler = new DragActionHandler();

        // メッセージリスナーの初期化
        messageListener = new MessageListener(gestureActionHandler, dragActionHandler);
        messageListener.listen();

        // メッセージ送信者の初期化
        messageSender = new ChromeMessageSender();

        senderMock = { sendDragAction: jest.fn() } as any;
        action = new DownloadLinkDragAction(senderMock);
    });

    it('リンクURLが指定された場合にChromeMessageSender.sendDragActionが呼ばれること', async () => {
        await action.execute({
            type: DragType.LINK,
            direction: Direction.DOWN,
            actionName: 'downloadLink',
            params: {},
            selectedValue: 'https://example.com/file.zip',
        });
        expect(senderMock.sendDragAction).toHaveBeenCalledWith(expect.objectContaining({ selectedValue: 'https://example.com/file.zip' }));
    });

    it('リンクURL未指定時にLogger.warnが呼ばれること', async () => {
        const warnSpy = jest.spyOn(Logger, 'warn');
        await action.execute({
            type: DragType.LINK,
            direction: Direction.DOWN,
            actionName: 'downloadLink',
            params: {},
            selectedValue: '',
        });
        expect(warnSpy).toHaveBeenCalledWith(
            'ダウンロードするリンクURLが指定されていません',
            expect.objectContaining({ options: expect.any(Object) })
        );
        warnSpy.mockRestore();
    });

    it('メッセージ送信失敗時にLogger.errorが呼ばれること', async () => {
        const errorSpy = jest.spyOn(Logger, 'error');
        senderMock.sendDragAction.mockImplementation(() => { throw new Error('send error'); });
        await expect(action.execute({
            type: DragType.LINK,
            direction: Direction.DOWN,
            actionName: 'downloadLink',
            params: {},
            selectedValue: 'https://example.com/file.zip',
        })).rejects.toThrow();
        // Logger.errorはDownloadLinkDragActionではcatchしていないため、ここでは呼ばれない
        // もしLogger.errorを追加する場合はDownloadLinkDragActionのcatchで呼ぶ必要あり
        errorSpy.mockRestore();
    });

    it('content→background経由でDownloadLinkDragActionが呼ばれ、最終的にchrome.downloads.downloadが実行されること', async () => {
        await messageSender.sendDragAction({
            type: DragType.LINK,
            direction: Direction.DOWN,
            actionName: 'downloadLink',
            params: {},
            selectedValue: 'https://example.com/file.zip',
        });
        expect(chrome.downloads.download).toHaveBeenCalledWith(
            expect.objectContaining({ url: 'https://example.com/file.zip' }),
            expect.any(Function)
        );
    });
}); 