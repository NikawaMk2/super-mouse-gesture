import { ChromeMessageSender } from '../../../src/content/services/message/message_sender';
import { MessageListener } from '../../../src/background/services/message_listener';
import { GestureActionHandler } from '../../../src/background/services/gesture_action_handler';
import { DragActionHandler } from '../../../src/background/services/drag_action_handler';
import { CloseWindowGestureAction } from '../../../src/content/services/gesture_action/close_window_gesture_action';

describe('CloseWindowGestureAction Integration', () => {
    let messageSender: ChromeMessageSender;
    let messageListener: MessageListener;
    let gestureActionHandler: GestureActionHandler;
    let dragActionHandler: DragActionHandler;
    let closeWindowGestureAction: CloseWindowGestureAction;

    beforeEach(() => {
        // console.errorのモック化
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // ハンドラーの初期化
        gestureActionHandler = new GestureActionHandler();
        dragActionHandler = new DragActionHandler();
        
        // メッセージリスナーの初期化
        messageListener = new MessageListener(gestureActionHandler, dragActionHandler);
        messageListener.listen();
        
        // メッセージ送信者の初期化
        messageSender = new ChromeMessageSender();
        
        // テスト対象のアクション初期化
        closeWindowGestureAction = new CloseWindowGestureAction(messageSender);

        // chrome.windows.removeのモックを設定
        (chrome.windows.remove as jest.Mock) = jest.fn((windowId, callback) => {
            if (callback) callback();
        });
        // chrome.windows.getCurrentのモックを設定
        (chrome.windows.getCurrent as jest.Mock) = jest.fn((callback) => {
            if (callback) callback({ id: 1 });
        });
    });

    afterEach(() => {
        // モックのリセット
        jest.clearAllMocks();
    });

    it('コンテンツスクリプトからバックグラウンドスクリプトへウィンドウを閉じるジェスチャアクションを実行できること', async () => {
        // アクションの実行
        await closeWindowGestureAction.execute();

        // chrome.windows.removeが現在のウィンドウに対して呼ばれたことを確認
        expect(chrome.windows.remove).toHaveBeenCalledWith(1, expect.any(Function));
    });

    it('ウィンドウを閉じる操作に失敗した場合、エラーが適切に処理されること', async () => {
        // エラーを発生させる
        const error = new Error('Failed to close window');
        (chrome.windows.remove as jest.Mock).mockImplementationOnce((windowId, callback) => {
            throw error;
        });

        // アクションの実行
        await closeWindowGestureAction.execute();

        // エラーがログに記録されたことを確認
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('ジェスチャアクション実行エラー'),
            expect.objectContaining({
                error: error.message,
                payload: expect.any(Object)
            })
        );
    });

    it('現在のウィンドウが取得できない場合、エラーが適切に処理されること', async () => {
        // 現在のウィンドウが取得できない状態をモック
        (chrome.windows.getCurrent as jest.Mock).mockImplementationOnce((callback) => {
            if (callback) callback(null);
        });

        // アクションの実行
        await closeWindowGestureAction.execute();

        // エラーがログに記録されたことを確認
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('ジェスチャアクション実行エラー'),
            expect.objectContaining({
                error: expect.any(String),
                payload: expect.any(Object)
            })
        );
    });
}); 