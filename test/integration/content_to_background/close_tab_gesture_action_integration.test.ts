import { ChromeMessageSender } from '../../../src/content/services/message/message_sender';
import { MessageListener } from '../../../src/background/services/message_listener';
import { GestureActionHandler } from '../../../src/background/services/gesture_action_handler';
import { DragActionHandler } from '../../../src/background/services/drag_action_handler';
import { CloseTabGestureAction } from '../../../src/content/services/gesture_action/close_tab_gesture_action';

describe('CloseTabGestureAction Integration', () => {
    let messageSender: ChromeMessageSender;
    let messageListener: MessageListener;
    let gestureActionHandler: GestureActionHandler;
    let dragActionHandler: DragActionHandler;
    let closeTabGestureAction: CloseTabGestureAction;

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
        closeTabGestureAction = new CloseTabGestureAction(messageSender);

        // chrome.tabs.queryのモックを設定
        (chrome.tabs.query as jest.Mock) = jest.fn((queryInfo, callback) => {
            callback([{ id: 1, index: 0 }]);
        });
        // chrome.tabs.removeのモックを設定
        (chrome.tabs.remove as jest.Mock) = jest.fn((tabId, callback) => {
            if (callback) callback();
        });
    });

    afterEach(() => {
        // モックのリセット
        jest.clearAllMocks();
    });

    it('コンテンツスクリプトからバックグラウンドスクリプトへタブを閉じるジェスチャアクションを実行できること', async () => {
        // アクションの実行
        await closeTabGestureAction.execute();

        // chrome.tabs.removeが正しい引数で呼ばれたことを確認
        expect(chrome.tabs.remove).toHaveBeenCalledWith(1, expect.any(Function));
    });

    it('タブを閉じる操作に失敗した場合、エラーが適切に処理されること', async () => {
        // エラーを発生させる
        const error = new Error('Failed to close tab');
        (chrome.tabs.remove as jest.Mock).mockImplementationOnce(() => {
            throw error;
        });

        // アクションの実行
        await closeTabGestureAction.execute();

        // エラーがログに記録されたことを確認
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('ジェスチャアクション実行エラー'),
            expect.objectContaining({
                error: error.message,
                payload: expect.any(Object)
            })
        );
    });

    it('アクティブなタブが存在しない場合、アクションが実行されないこと', async () => {
        // アクティブなタブが存在しない状態をモック
        (chrome.tabs.query as jest.Mock).mockImplementationOnce((queryInfo, callback) => {
            callback([]);
        });

        // アクションの実行
        await closeTabGestureAction.execute();

        // chrome.tabs.removeが呼ばれていないことを確認
        expect(chrome.tabs.remove).not.toHaveBeenCalled();
        // エラーがログに記録されていないことを確認
        expect(console.error).not.toHaveBeenCalled();
    });
}); 