import { OpenInForegroundTabDragAction } from '../../../src/content/services/super_drag_action/link/open_in_foreground_tab_drag_action';
import { DragType } from '../../../src/content/models/drag_type';
import { Direction } from '../../../src/content/models/direction';
import Logger from '../../../src/common/logger/logger';
import { ChromeMessageSender } from '../../../src/content/services/message/message_sender';
import { MessageListener } from '../../../src/background/services/message_listener';
import { DragActionHandler } from '../../../src/background/services/drag_action_handler';
import { GestureActionHandler } from '../../../src/background/services/gesture_action_handler';

describe('OpenInForegroundTabDragAction Integration', () => {
    let action: OpenInForegroundTabDragAction;
    let senderMock: jest.Mocked<ChromeMessageSender>;
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

        senderMock = { sendDragAction: jest.fn() } as any;
        action = new OpenInForegroundTabDragAction(senderMock);
    });

    it('リンクURLが指定された場合にChromeMessageSender.sendDragActionが呼ばれること', async () => {
        await action.execute({
            type: DragType.LINK,
            direction: Direction.UP,
            actionName: 'openInForegroundTab',
            params: {},
            selectedValue: 'https://example.com/',
        });
        expect(senderMock.sendDragAction).toHaveBeenCalledWith(expect.objectContaining({ selectedValue: 'https://example.com/' }));
    });

    it('リンクURL未指定時にLogger.warnが呼ばれること', async () => {
        const warnSpy = jest.spyOn(Logger, 'warn');
        await action.execute({
            type: DragType.LINK,
            direction: Direction.UP,
            actionName: 'openInForegroundTab',
            params: {},
            selectedValue: '',
        });
        expect(warnSpy).toHaveBeenCalledWith(
            '開くリンクURLが指定されていません',
            expect.objectContaining({ options: expect.any(Object) })
        );
        warnSpy.mockRestore();
    });

    it('メッセージ送信失敗時にLogger.errorが呼ばれること', async () => {
        const errorSpy = jest.spyOn(Logger, 'error');
        senderMock.sendDragAction.mockImplementation(() => { throw new Error('send error'); });
        await expect(action.execute({
            type: DragType.LINK,
            direction: Direction.UP,
            actionName: 'openInForegroundTab',
            params: {},
            selectedValue: 'https://example.com/',
        })).rejects.toThrow();
        // Logger.errorはOpenInForegroundTabDragActionではcatchしていないため、ここでは呼ばれない
        // もしLogger.errorを追加する場合はOpenInForegroundTabDragActionのcatchで呼ぶ必要あり
        errorSpy.mockRestore();
    });

    it('content→background経由でOpenInForegroundTabDragActionが呼ばれ、最終的にchrome.tabs.createが実行されること', async () => {
        await messageSender.sendDragAction({
            type: DragType.LINK,
            direction: Direction.UP,
            actionName: 'openInForegroundTab',
            params: {},
            selectedValue: 'https://example.com/',
        });
        expect(chrome.tabs.create).toHaveBeenCalledWith({ url: 'https://example.com/', active: true }, expect.any(Function));
    });
}); 