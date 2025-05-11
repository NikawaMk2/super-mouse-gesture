import { ChromeMessageSender } from '../../../src/content/services/message/message_sender';
import { MessageListener } from '../../../src/background/services/message_listener';
import { GestureActionHandler } from '../../../src/background/services/gesture_action_handler';
import { DragActionHandler } from '../../../src/background/services/drag_action_handler';
import { PrevTabGestureAction } from '../../../src/content/services/gesture_action/prev_tab_gesture_action';

describe('PrevTabGestureAction Integration', () => {
    let messageSender: ChromeMessageSender;
    let messageListener: MessageListener;
    let gestureActionHandler: GestureActionHandler;
    let dragActionHandler: DragActionHandler;
    let prevTabGestureAction: PrevTabGestureAction;

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
        prevTabGestureAction = new PrevTabGestureAction(messageSender);

        // chrome.tabs.queryのモックを設定
        (chrome.tabs.query as jest.Mock) = jest.fn((queryInfo, callback) => {
            callback([
                { id: 2, index: 1 },  // 現在のタブ
                { id: 1, index: 0 }   // 前のタブ
            ]);
        });
        // chrome.tabs.updateのモックを設定
        (chrome.tabs.update as jest.Mock) = jest.fn((tabId, updateInfo, callback) => {
            if (callback) callback();
        });
    });

    afterEach(() => {
        // モックのリセット
        jest.clearAllMocks();
    });

    it('コンテンツスクリプトからバックグラウンドスクリプトへ前のタブに移動するジェスチャアクションを実行できること', async () => {
        // アクションの実行
        await prevTabGestureAction.execute();

        // chrome.tabs.updateが前のタブに対してアクティブ状態で呼ばれたことを確認
        expect(chrome.tabs.update).toHaveBeenCalledWith(1, { active: true }, expect.any(Function));
    });

    it('前のタブへの移動に失敗した場合、エラーが適切に処理されること', async () => {
        // エラーを発生させる
        const error = new Error('Failed to move to previous tab');
        (chrome.tabs.update as jest.Mock).mockImplementationOnce(() => {
            throw error;
        });

        // アクションの実行
        await prevTabGestureAction.execute();

        // エラーがログに記録されたことを確認
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('ジェスチャアクション実行エラー'),
            expect.objectContaining({
                error: error.message,
                payload: expect.any(Object)
            })
        );
    });

    it('先頭がアクティブタブのみの場合、末尾のタブに移動すること', async () => {
        (chrome.tabs.query as jest.Mock).mockImplementation((queryInfo, callback) => {
            if (queryInfo.active) {
                callback([{ id: 1, index: 0, active: true }]);
            } else {
                callback([
                    { id: 1, index: 0, active: true },
                    { id: 2, index: 1, active: false },
                    { id: 3, index: 2, active: false },
                ]);
            }
        });

        // アクションの実行
        await prevTabGestureAction.execute();

        // chrome.tabs.updateが呼ばれることを確認
        expect(chrome.tabs.update).toHaveBeenCalledWith(3, { active: true }, expect.any(Function));
        // エラーがログに記録されていないことを確認
        expect(console.error).not.toHaveBeenCalled();
    });

    it('アクティブなタブが存在しない場合、アクションが実行されないこと', async () => {
        // アクティブなタブが存在しない状態をモック
        (chrome.tabs.query as jest.Mock).mockImplementationOnce((queryInfo, callback) => {
            callback([]);
        });

        // アクションの実行
        await prevTabGestureAction.execute();

        // chrome.tabs.updateが呼ばれていないことを確認
        expect(chrome.tabs.update).not.toHaveBeenCalled();
        // エラーがログに記録されていないことを確認
        expect(console.error).not.toHaveBeenCalled();
    });
}); 