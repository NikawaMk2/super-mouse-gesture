import { ChromeMessageSender } from '../../../src/content/services/message/message_sender';
import { MessageListener } from '../../../src/background/services/message_listener';
import { GestureActionHandler } from '../../../src/background/services/gesture_action_handler';
import { DragActionHandler } from '../../../src/background/services/drag_action_handler';
import { CloseTabToRightGestureAction } from '../../../src/content/services/gesture_action/close_tab_to_right_gesture_action';

describe('CloseTabToRightGestureAction Integration', () => {
    let messageSender: ChromeMessageSender;
    let messageListener: MessageListener;
    let gestureActionHandler: GestureActionHandler;
    let dragActionHandler: DragActionHandler;
    let closeTabToRightGestureAction: CloseTabToRightGestureAction;

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
        closeTabToRightGestureAction = new CloseTabToRightGestureAction(messageSender);

        // chrome.tabs.removeのモックを設定
        (chrome.tabs.remove as jest.Mock) = jest.fn((tabId, callback) => {
            if (callback) callback();
        });
        // chrome.tabs.queryのモックを設定
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
        // chrome.tabs.updateのモックを設定
        (chrome.tabs.update as jest.Mock) = jest.fn((tabId, updateInfo, callback) => {
            if (callback) callback();
        });
    });

    afterEach(() => {
        // モックのリセット
        jest.clearAllMocks();
    });

    it('コンテンツスクリプトからバックグラウンドスクリプトへ右側のタブを閉じるジェスチャアクションを実行できること', async () => {
        // アクションの実行
        await closeTabToRightGestureAction.execute();

        // chrome.tabs.removeがアクティブタブに対して呼ばれたことを確認
        expect(chrome.tabs.remove).toHaveBeenCalledWith(1, expect.any(Function));
        // chrome.tabs.updateが右隣のタブに対して呼ばれたことを確認
        expect(chrome.tabs.update).toHaveBeenCalledWith(2, { active: true }, expect.any(Function));
    });

    it('タブを閉じる操作に失敗した場合、エラーが適切に処理されること', async () => {
        // エラーを発生させる
        const error = new Error('Failed to close tabs');
        (chrome.tabs.remove as jest.Mock).mockImplementationOnce(() => {
            throw error;
        });

        // アクションの実行
        await closeTabToRightGestureAction.execute();

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
        await closeTabToRightGestureAction.execute();

        // chrome.tabs.removeが呼ばれていないことを確認
        expect(chrome.tabs.remove).not.toHaveBeenCalled();
        // chrome.tabs.updateが呼ばれていないことを確認
        expect(chrome.tabs.update).not.toHaveBeenCalled();
        // エラーがログに記録されていないことを確認
        expect(console.error).not.toHaveBeenCalled();
    });

    it('アクティブなタブが最後のタブの場合、chrome.tabs.removeのみが呼ばれ、エラーも発生しないこと', async () => {
        // アクティブなタブが最後のタブの状態をモック
        (chrome.tabs.query as jest.Mock).mockImplementation((queryInfo, callback) => {
            if (queryInfo.active) {
                callback([{ id: 3, index: 2, active: true }]);
            } else {
                callback([
                    { id: 1, index: 0, active: false },
                    { id: 2, index: 1, active: false },
                    { id: 3, index: 2, active: true },
                ]);
            }
        });

        // アクションの実行
        await closeTabToRightGestureAction.execute();

        // chrome.tabs.removeが呼ばれていることを確認
        expect(chrome.tabs.remove).toHaveBeenCalledWith(3, expect.any(Function));
        // chrome.tabs.updateが呼ばれていないことを確認
        expect(chrome.tabs.update).not.toHaveBeenCalled();
        // エラーがログに記録されていないことを確認
        expect(console.error).not.toHaveBeenCalled();
    });
}); 