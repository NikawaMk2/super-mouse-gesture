import { ChromeMessageSender } from '../../../src/content/services/message/message_sender';
import { MessageListener } from '../../../src/background/services/message_listener';
import { DragActionHandler } from '../../../src/background/services/drag_action_handler';
import { GestureActionHandler } from '../../../src/background/services/gesture_action_handler';
import { DragType } from '../../../src/content/models/drag_type';
import { Direction } from '../../../src/content/models/direction';

describe('DownloadImageDragAction Integration', () => {
    let messageSender: ChromeMessageSender;
    let messageListener: MessageListener;
    let dragActionHandler: DragActionHandler;
    let gestureActionHandler: GestureActionHandler;

    beforeEach(() => {
        jest.clearAllMocks();

        // ハンドラーの初期化
        gestureActionHandler = new GestureActionHandler();
        dragActionHandler = new DragActionHandler();

        // メッセージリスナーの初期化
        messageListener = new MessageListener(gestureActionHandler, dragActionHandler);
        messageListener.listen();

        // メッセージ送信者の初期化
        messageSender = new ChromeMessageSender();
    });

    it('content→background経由でDownloadImageDragActionが呼ばれ、最終的にchrome.downloads.downloadが実行されること', async () => {
        await messageSender.sendDragAction({
            type: DragType.IMAGE,
            direction: Direction.DOWN,
            actionName: 'downloadImage',
            params: {},
            selectedValue: 'https://example.com/image.png',
        });
        expect(chrome.downloads.download).toHaveBeenCalledWith({ url: 'https://example.com/image.png' });
    });

    it('異常系: 画像URL未指定時に警告ログが出ること', async () => {
        const logger = await import('../../../src/common/logger/logger');
        const warnSpy = jest.spyOn(logger.default, 'warn');
        await messageSender.sendDragAction({
            type: DragType.IMAGE,
            direction: Direction.DOWN,
            actionName: 'downloadImage',
            params: {},
            selectedValue: '', // URL未指定
        });
        expect(warnSpy).toHaveBeenCalledWith(
            'ダウンロードする画像URLが指定されていません',
            expect.objectContaining({
                payload: expect.objectContaining({
                    type: DragType.IMAGE,
                    direction: Direction.DOWN,
                    actionName: 'downloadImage',
                    selectedValue: '',
                })
            })
        );
        warnSpy.mockRestore();
    });
}); 