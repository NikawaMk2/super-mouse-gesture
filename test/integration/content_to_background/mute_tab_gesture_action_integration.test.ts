import { ChromeMessageSender } from '../../../src/content/services/message/message_sender';
import { MessageListener } from '../../../src/background/services/message_listener';
import { GestureActionHandler } from '../../../src/background/services/gesture_action_handler';
import { DragActionHandler } from '../../../src/background/services/drag_action_handler';
import { MuteTabGestureAction } from '../../../src/content/services/gesture_action/mute_tab_gesture_action';

describe('MuteTabGestureAction Integration', () => {
    let messageSender: ChromeMessageSender;
    let messageListener: MessageListener;
    let gestureActionHandler: GestureActionHandler;
    let dragActionHandler: DragActionHandler;
    let muteTabGestureAction: MuteTabGestureAction;

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
        muteTabGestureAction = new MuteTabGestureAction(messageSender);

        // chrome.tabs.queryのモックを設定
        (chrome.tabs.query as jest.Mock) = jest.fn((queryInfo, callback) => {
            callback([{ id: 1, index: 0, active: true, mutedInfo: { muted: false } }]);
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

    it('コンテンツスクリプトからバックグラウンドスクリプトへタブをミュートするジェスチャアクションを実行できること', async () => {
        // アクションの実行
        await muteTabGestureAction.execute();

        // chrome.tabs.updateが正しい引数で呼ばれたことを確認
        expect(chrome.tabs.update).toHaveBeenCalledWith(1, { muted: true }, expect.any(Function));
    });

    it('タブのミュートに失敗した場合、エラーが適切に処理されること', async () => {
        // エラーを発生させる
        const error = new Error('Failed to mute tab');
        (chrome.tabs.update as jest.Mock).mockImplementationOnce(() => {
            throw error;
        });

        // アクションの実行
        await muteTabGestureAction.execute();

        // エラーがログに記録されたことを確認
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('ジェスチャアクション実行エラー'),
            expect.objectContaining({
                error: error.message,
                payload: expect.any(Object)
            })
        );
    });

    it('タブが既にミュートされている場合、ミュートを解除すること', async () => {
        // 既にミュートされているタブをモック
        (chrome.tabs.query as jest.Mock).mockImplementationOnce((queryInfo, callback) => {
            callback([{ id: 1, index: 0, active: true, mutedInfo: { muted: true } }]);
        });

        // アクションの実行
        await muteTabGestureAction.execute();

        // chrome.tabs.updateが正しい引数で呼ばれたことを確認
        expect(chrome.tabs.update).toHaveBeenCalledWith(1, { muted: false }, expect.any(Function));
    });

    it('アクティブなタブが存在しない場合、アクションが実行されないこと', async () => {
        // アクティブなタブが存在しない状態をモック
        (chrome.tabs.query as jest.Mock).mockImplementationOnce((queryInfo, callback) => {
            callback([]);
        });

        // アクションの実行
        await muteTabGestureAction.execute();

        // chrome.tabs.updateが呼ばれていないことを確認
        expect(chrome.tabs.update).not.toHaveBeenCalled();
        // エラーがログに記録されていないことを確認
        expect(console.error).not.toHaveBeenCalled();
    });
}); 