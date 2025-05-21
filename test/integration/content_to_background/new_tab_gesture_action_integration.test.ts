import { ChromeMessageSender } from '../../../src/content/services/message/message_sender';
import { MessageListener } from '../../../src/background/services/message_listener';
import { GestureActionHandler } from '../../../src/background/services/gesture_action_handler';
import { DragActionHandler } from '../../../src/background/services/drag_action_handler';
import { NewTabGestureAction } from '../../../src/content/services/gesture_action/new_tab_gesture_action';

describe('NewTabGestureAction Integration', () => {
    let messageSender: ChromeMessageSender;
    let messageListener: MessageListener;
    let gestureActionHandler: GestureActionHandler;
    let dragActionHandler: DragActionHandler;
    let newTabGestureAction: NewTabGestureAction;

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
        newTabGestureAction = new NewTabGestureAction(messageSender);

        // chrome.tabs.createのモックを設定
        (chrome.tabs.create as jest.Mock) = jest.fn((createProperties, callback) => {
            if (callback) callback();
        });
    });

    afterEach(() => {
        // モックのリセット
        jest.clearAllMocks();
    });

    it('コンテンツスクリプトからバックグラウンドスクリプトへ新しいタブを開くジェスチャアクションを実行できること', async () => {
        // アクションの実行
        await newTabGestureAction.execute();

        // chrome.tabs.createが呼ばれたことを確認
        expect(chrome.tabs.create).toHaveBeenCalledWith({
            active: true,
            url: 'chrome://newtab'
        },
        expect.any(Function)
    );
    });

    it('新しいタブの作成に失敗した場合、エラーが適切に処理されること', async () => {
        // エラーを発生させる
        const error = new Error('Failed to create tab');
        (chrome.tabs.create as jest.Mock).mockImplementationOnce((createProperties, callback) => {
            throw error;
        });

        // アクションの実行
        await newTabGestureAction.execute();

        // エラーがログに記録されたことを確認
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('ジェスチャアクション実行エラー'),
            expect.objectContaining({
                error: error.message,
                payload: expect.any(Object)
            })
        );
    });
}); 