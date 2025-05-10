import { ChromeMessageSender } from '../../../src/content/services/message/message_sender';
import { MessageListener } from '../../../src/background/services/message_listener';
import { GestureActionHandler } from '../../../src/background/services/gesture_action_handler';
import { DragActionHandler } from '../../../src/background/services/drag_action_handler';
import { NewIncognitoWindowGestureAction } from '../../../src/content/services/gesture_action/new_incognito_window_gesture_action';

describe('NewIncognitoWindowGestureAction Integration', () => {
    let messageSender: ChromeMessageSender;
    let messageListener: MessageListener;
    let gestureActionHandler: GestureActionHandler;
    let dragActionHandler: DragActionHandler;
    let newIncognitoWindowGestureAction: NewIncognitoWindowGestureAction;

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
        newIncognitoWindowGestureAction = new NewIncognitoWindowGestureAction(messageSender);

        // chrome.windows.createのモックを設定
        (chrome.windows.create as jest.Mock) = jest.fn((createData, callback) => {
            if (callback) callback();
        });
    });

    afterEach(() => {
        // モックのリセット
        jest.clearAllMocks();
    });

    it('コンテンツスクリプトからバックグラウンドスクリプトへシークレットウィンドウを新規作成するジェスチャアクションを実行できること', async () => {
        // アクションの実行
        await newIncognitoWindowGestureAction.execute();

        // chrome.windows.createがシークレットモードで呼ばれたことを確認
        expect(chrome.windows.create).toHaveBeenCalledWith({incognito: true}, expect.any(Function));
    });

    it('シークレットウィンドウの作成に失敗した場合、エラーが適切に処理されること', async () => {
        // エラーを発生させる
        const error = new Error('Failed to create incognito window');
        (chrome.windows.create as jest.Mock).mockImplementationOnce(() => {
            throw error;
        });

        // アクションの実行
        await newIncognitoWindowGestureAction.execute();

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