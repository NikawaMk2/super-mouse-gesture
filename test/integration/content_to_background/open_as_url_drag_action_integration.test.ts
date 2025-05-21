import { OpenAsUrlDragAction } from '../../../src/content/services/super_drag_action/text/open_as_url_drag_action';
import { DragType } from '../../../src/content/models/drag_type';
import { Direction } from '../../../src/content/models/direction';
import Logger from '../../../src/common/logger/logger';
import { IDragActionMessageSender } from '../../../src/content/services/message/message_sender';
import { ChromeMessageSender } from '../../../src/content/services/message/message_sender';
import { MessageListener } from '../../../src/background/services/message_listener';
import { DragActionHandler } from '../../../src/background/services/drag_action_handler';
import { GestureActionHandler } from '../../../src/background/services/gesture_action_handler';

describe('OpenAsUrlDragAction Integration', () => {
    let action: OpenAsUrlDragAction;
    let senderMock: jest.Mocked<IDragActionMessageSender>;
    let messageSender: ChromeMessageSender;
    let messageListener: MessageListener;
    let dragActionHandler: DragActionHandler;
    let gestureActionHandler: GestureActionHandler;

    beforeEach(() => {
        (chrome.tabs.create as jest.Mock) = jest.fn((createProperties, callback) => {
            if (callback) callback({ id: 789 });
        });
        (chrome.tabs.update as jest.Mock) = jest.fn((tabId, updateProperties, callback) => {
            if (callback) callback();
        });
        (chrome.tabs.query as jest.Mock) = jest.fn((queryInfo, callback) => {
            callback([{ id: 111 }]);
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

    it('content→background経由でOpenAsUrlDragActionが呼ばれ、params.newTab=trueならchrome.tabs.createが実行されること', async () => {
        await messageSender.sendDragAction({
            type: DragType.TEXT,
            direction: Direction.UP,
            actionName: 'openAsUrl',
            params: { newTab: true },
            selectedValue: 'example.com',
        });
        expect(chrome.tabs.create).toHaveBeenCalledWith({ url: expect.stringContaining('example.com'), active: true }, expect.any(Function));
    });

    it('content→background経由でOpenAsUrlDragActionが呼ばれ、params.newTab=falseならchrome.tabs.updateが実行されること', async () => {
        await messageSender.sendDragAction({
            type: DragType.TEXT,
            direction: Direction.UP,
            actionName: 'openAsUrl',
            params: { newTab: false },
            selectedValue: 'example.com',
        });
        expect(chrome.tabs.update).toHaveBeenCalledWith(111, { url: expect.stringContaining('example.com') }, expect.any(Function));
    });
}); 