import { ChromeMessageSender } from '../../../src/content/services/message/message_sender';
import { MessageListener } from '../../../src/background/services/message_listener';
import { GestureActionHandler } from '../../../src/background/services/gesture_action_handler';
import { DragActionHandler } from '../../../src/background/services/drag_action_handler';
import { NextTabGestureAction } from '../../../src/content/services/gesture_action/next_tab_gesture_action';

describe('NextTabGestureAction Integration', () => {
    let messageSender: ChromeMessageSender;
    let messageListener: MessageListener;
    let gestureActionHandler: GestureActionHandler;
    let dragActionHandler: DragActionHandler;
    let nextTabGestureAction: NextTabGestureAction;

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
        nextTabGestureAction = new NextTabGestureAction(messageSender);

        // chrome.tabs.queryのモックを設定
        (chrome.tabs.query as jest.Mock).mockImplementation((queryInfo, callback) => {
            if (queryInfo.active) {
                callback([{ id: 1, index: 0, active: true }]);
            } else {
                callback([
                    { id: 1, index: 0, active: true },
                    { id: 2, index: 1, active: false },
                ]);
            }
        });        // chrome.tabs.updateのモックを設定
        (chrome.tabs.update as jest.Mock) = jest.fn((tabId, updateProperties, callback) => {
            if (callback) callback();
        });
    });

    afterEach(() => {
        // モックのリセット
        jest.clearAllMocks();
    });

    it('コンテンツスクリプトからバックグラウンドスクリプトへ次のタブに移動するジェスチャアクションを実行できること', async () => {
        // アクションの実行
        await nextTabGestureAction.execute();

        // chrome.tabs.updateが次のタブに対してアクティブ状態で呼ばれたことを確認
        expect(chrome.tabs.update).toHaveBeenCalledWith(2, { active: true }, expect.any(Function));
    });

    it('次のタブへの移動に失敗した場合、エラーが適切に処理されること', async () => {
        // エラーを発生させる
        const error = new Error('Failed to move to next tab');
        (chrome.tabs.update as jest.Mock).mockImplementationOnce(() => {
            throw error;
        });

        // アクションの実行
        await nextTabGestureAction.execute();

        // エラーがログに記録されたことを確認
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('ジェスチャアクション実行エラー'),
            expect.objectContaining({
                error: error.message,
                payload: expect.any(Object)
            })
        );
    });

    it('タブがアクティブタブのみの場合、アクションが実行されないこと', async () => {
        // アクティブタブ以外が存在しない状態をモック
        (chrome.tabs.query as jest.Mock).mockImplementationOnce((queryInfo, callback) => {
            callback([
                { id: 1, index: 0, active: true },
            ]);
        });

        // アクションの実行
        await nextTabGestureAction.execute();

        // chrome.tabs.updateが呼ばれていないことを確認
        expect(chrome.tabs.update).not.toHaveBeenCalled();
        // エラーがログに記録されていないことを確認
        expect(console.error).not.toHaveBeenCalled();
    });

    it('末尾がアクティブタブのみの場合、先頭のタブに移動すること', async () => {
        (chrome.tabs.query as jest.Mock).mockImplementation((queryInfo, callback) => {
            if (queryInfo.active) {
                callback([{ id: 2, index: 1, active: true }]);
            } else {
                callback([
                    { id: 1, index: 0, active: false },
                    { id: 2, index: 1, active: true },
                ]);
            }
        });        // chrome.tabs.updateのモックを設定

        // アクションの実行
        await nextTabGestureAction.execute();

        // chrome.tabs.updateが先頭のタブに対してアクティブ状態で呼ばれたことを確認
        expect(chrome.tabs.update).toHaveBeenCalledWith(1, { active: true }, expect.any(Function));
    });

    it('アクティブなタブが存在しない場合、アクションが実行されないこと', async () => {
        // アクティブなタブが存在しない状態をモック
        (chrome.tabs.query as jest.Mock).mockImplementationOnce((queryInfo, callback) => {
            callback([]);
        });

        // アクションの実行
        await nextTabGestureAction.execute();

        // chrome.tabs.updateが呼ばれていないことを確認
        expect(chrome.tabs.update).not.toHaveBeenCalled();
        // エラーがログに記録されていないことを確認
        expect(console.error).not.toHaveBeenCalled();
    });
}); 