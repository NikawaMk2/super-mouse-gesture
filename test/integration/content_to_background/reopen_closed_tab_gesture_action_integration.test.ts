import { ChromeMessageSender } from '../../../src/content/services/message/message_sender';
import { MessageListener } from '../../../src/background/services/message_listener';
import { GestureActionHandler } from '../../../src/background/services/gesture_action_handler';
import { DragActionHandler } from '../../../src/background/services/drag_action_handler';
import { ReopenClosedTabGestureAction } from '../../../src/content/services/gesture_action/reopen_closed_tab_gesture_action';

describe('ReopenClosedTabGestureAction Integration', () => {
    let messageSender: ChromeMessageSender;
    let messageListener: MessageListener;
    let gestureActionHandler: GestureActionHandler;
    let dragActionHandler: DragActionHandler;
    let reopenClosedTabGestureAction: ReopenClosedTabGestureAction;

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
        reopenClosedTabGestureAction = new ReopenClosedTabGestureAction(messageSender);

        // chrome.sessions.restoreのモックを設定
        (chrome.sessions.restore as jest.Mock) = jest.fn((callback) => {
            if (callback) callback();
        });
    });

    afterEach(() => {
        // モックのリセット
        jest.clearAllMocks();
    });

    it('コンテンツスクリプトからバックグラウンドスクリプトへ閉じたタブを再度開くジェスチャアクションを実行できること', async () => {
        // アクションの実行
        await reopenClosedTabGestureAction.execute();

        // chrome.sessions.restoreが呼ばれたことを確認
        expect(chrome.sessions.restore).toHaveBeenCalled();
    });

    it('タブの再オープンに失敗した場合、エラーが適切に処理されること', async () => {
        // エラーを発生させる
        const error = new Error('Failed to reopen closed tab');
        (chrome.sessions.restore as jest.Mock).mockImplementationOnce((callback) => {
            throw error;
        });

        // アクションの実行
        await reopenClosedTabGestureAction.execute();

        // エラーがログに記録されたことを確認
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('ジェスチャアクション実行エラー'),
            expect.objectContaining({
                error: error.message,
                payload: expect.any(Object)
            })
        );
    });

    it('閉じたタブが存在しない場合、エラーが適切に処理されること', async () => {
        // 閉じたタブが存在しない状態をモック
        (chrome.sessions.restore as jest.Mock).mockImplementationOnce((callback) => {
            throw new Error('No recently closed tabs');
        });

        // アクションの実行
        await reopenClosedTabGestureAction.execute();

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