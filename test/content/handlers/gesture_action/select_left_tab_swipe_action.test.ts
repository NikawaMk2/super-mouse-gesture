import 'reflect-metadata';
import { Container } from 'inversify';
import { MessageSender } from '../../../../src/common/messaging/message_sender';
import BackgroundMessage from '../../../../src/common/messaging/types/background_message_type';
import Logger from '../../../../src/common/utils/logger';
import SelectLeftTabGestureAction from '../../../../src/content/handlers/gesture_action/select_left_tab_swipe_action';

// ContainerProviderのモックを設定
jest.mock('../../../../src/common/utils/container_provider');

// モック化されたTYPESをインポート
import { TYPES } from '../../../../src/common/utils/container_provider';

describe('SelectLeftTabGestureActionクラスのテスト', () => {
    let action: SelectLeftTabGestureAction;
    let mockMessenger: jest.Mocked<MessageSender>;
    let mockLogger: jest.Mocked<typeof Logger>;

    beforeEach(() => {
        // MessageSenderのモック作成
        mockMessenger = {
            sendMessage: jest.fn().mockResolvedValue(undefined)
        };

        // Loggerのモック化
        jest.spyOn(Logger, 'debug').mockImplementation(jest.fn());
        mockLogger = Logger as jest.Mocked<typeof Logger>;

        // DIコンテナの設定
        const container = new Container();
        container.bind<MessageSender>(TYPES.MessageSender).toConstantValue(mockMessenger);
        container.bind(SelectLeftTabGestureAction).toSelf();

        // テスト対象のインスタンスを取得
        action = container.get(SelectLeftTabGestureAction);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('doActionメソッドのテスト', () => {
        it('メッセージが正しく送信されること', async () => {
            await action.doAction();

            expect(mockMessenger.sendMessage).toHaveBeenCalledTimes(1);
            expect(mockMessenger.sendMessage).toHaveBeenCalledWith(BackgroundMessage.SelectLeftTab);
        });

        it('デバッグログが出力されること', async () => {
            await action.doAction();

            expect(mockLogger.debug).toHaveBeenCalledTimes(1);
            expect(mockLogger.debug).toHaveBeenCalledWith('「左のタブを選択」のジェスチャーを実行');
        });

        it('エラー発生時に例外がスローされること', async () => {
            const error = new Error('Failed to send message');
            mockMessenger.sendMessage.mockRejectedValueOnce(error);

            await expect(action.doAction()).rejects.toThrow('Failed to send message');
        });
    });
}); 