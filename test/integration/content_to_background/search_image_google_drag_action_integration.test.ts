import { ChromeMessageSender } from '../../../src/content/services/message/message_sender';
import { MessageListener } from '../../../src/background/services/message_listener';
import { DragActionHandler } from '../../../src/background/services/drag_action_handler';
import { GestureActionHandler } from '../../../src/background/services/gesture_action_handler';
import { DragType } from '../../../src/content/models/drag_type';
import { Direction } from '../../../src/content/models/direction';

describe('SearchImageGoogleDragAction Integration', () => {
    let messageSender: ChromeMessageSender;
    let messageListener: MessageListener;
    let dragActionHandler: DragActionHandler;
    let gestureActionHandler: GestureActionHandler;

    beforeEach(() => {
        (chrome.tabs.create as jest.Mock) = jest.fn((createProperties, callback) => {
            if (callback) callback({ id: 123 });
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
    });

    it('content→background経由でSearchImageGoogleDragActionが呼ばれ、最終的にchrome.tabs.createが実行されること', async () => {
        await messageSender.sendDragAction({
            type: DragType.IMAGE,
            direction: Direction.RIGHT,
            actionName: 'searchImageGoogle',
            params: { urlTemplate: 'https://www.google.com/searchbyimage?image_url=%s' },
            selectedValue: 'https://example.com/image.png',
        });
        expect(chrome.tabs.create).toHaveBeenCalledWith({ url: expect.stringContaining('https://www.google.com/searchbyimage?image_url='), active: true }, expect.any(Function));
    });
}); 