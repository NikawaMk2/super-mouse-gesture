import { ChromeMessageSender } from '../../../src/content/services/message/message_sender';
import { MessageListener } from '../../../src/background/services/message_listener';
import { GestureActionHandler } from '../../../src/background/services/gesture_action_handler';
import { DragActionHandler } from '../../../src/background/services/drag_action_handler';
import { MaximizeWindowGestureAction } from '../../../src/content/services/gesture_action/maximize_window_gesture_action';

describe('MaximizeWindowGestureAction Integration', () => {
    let messageSender: ChromeMessageSender;
    let messageListener: MessageListener;
    let gestureActionHandler: GestureActionHandler;
    let dragActionHandler: DragActionHandler;
    let maximizeWindowGestureAction: MaximizeWindowGestureAction;

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
        maximizeWindowGestureAction = new MaximizeWindowGestureAction(messageSender);

        // chrome.windows.updateのモックを設定
        (chrome.windows.update as jest.Mock) = jest.fn((windowId, updateInfo, callback) => {
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

    it('コンテンツスクリプトからバックグラウンドスクリプトへウィンドウを最大化するジェスチャアクションを実行できること', async () => {
        // アクションの実行
        await maximizeWindowGestureAction.execute();

        // chrome.windows.updateが現在のウィンドウに対して最大化状態で呼ばれたことを確認
        expect(chrome.windows.update).toHaveBeenCalledWith(1, { state: 'maximized' }, expect.any(Function));
    });

    it('ウィンドウを最大化する操作に失敗した場合、エラーが適切に処理されること', async () => {
        // エラーを発生させる
        const error = new Error('Failed to maximize window');
        (chrome.windows.update as jest.Mock).mockImplementationOnce((windowId, updateInfo, callback) => {
            throw error;
        });

        // アクションの実行
        await maximizeWindowGestureAction.execute();

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
        await maximizeWindowGestureAction.execute();

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