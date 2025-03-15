import { Container } from 'inversify';
import Logger from '../../../../src/common/utils/logger';
import BackToPreviousGestureAction from '../../../../src/content/handlers/gesture_action/back_to_previous_swipe_action';

describe('BackToPreviousGestureActionクラスのテスト', () => {
    let action: BackToPreviousGestureAction;
    let mockLogger: jest.Mocked<typeof Logger>;
    let mockHistoryBack: jest.SpyInstance;

    beforeEach(() => {
        // Loggerのモック化
        jest.spyOn(Logger, 'debug').mockImplementation(jest.fn());
        mockLogger = Logger as jest.Mocked<typeof Logger>;

        // window.history.backのモック化
        mockHistoryBack = jest.spyOn(window.history, 'back').mockImplementation(jest.fn());

        // DIコンテナの設定
        const container = new Container();
        container.bind(BackToPreviousGestureAction).toSelf();
        action = container.get(BackToPreviousGestureAction);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('doActionメソッドのテスト', () => {
        it('履歴を戻る操作が実行されること', () => {
            action.doAction();

            expect(mockHistoryBack).toHaveBeenCalledTimes(1);
        });

        it('デバッグログが出力されること', () => {
            action.doAction();

            expect(mockLogger.debug).toHaveBeenCalledTimes(1);
            expect(mockLogger.debug).toHaveBeenCalledWith('「戻る」のジェスチャーを実行');
        });
    });
}); 