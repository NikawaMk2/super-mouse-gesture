import { Container } from 'inversify';
import Logger from '../../../../src/common/utils/logger';
import GoToNextGestureAction from '../../../../src/content/handlers/gesture_action/go_to_next_swipe_action';

describe('GoToNextGestureActionクラスのテスト', () => {
    let action: GoToNextGestureAction;
    let mockLogger: jest.Mocked<typeof Logger>;
    let mockHistoryForward: jest.SpyInstance;

    beforeAll(() => {
        // DOMの初期化
        document.documentElement.innerHTML = '<html><body></body></html>';
    });

    beforeEach(() => {
        // Loggerのモック化
        jest.spyOn(Logger, 'debug').mockImplementation(jest.fn());
        mockLogger = Logger as jest.Mocked<typeof Logger>;

        // window.history.forwardのモック化
        mockHistoryForward = jest.spyOn(window.history, 'forward').mockImplementation(jest.fn());

        // DIコンテナの設定
        const container = new Container();
        container.bind(GoToNextGestureAction).toSelf();
        action = container.get(GoToNextGestureAction);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('doActionメソッドのテスト', () => {
        it('履歴を進む操作が実行されること', () => {
            action.doAction();

            expect(mockHistoryForward).toHaveBeenCalledTimes(1);
        });

        it('デバッグログが出力されること', () => {
            action.doAction();

            expect(mockLogger.debug).toHaveBeenCalledTimes(1);
            expect(mockLogger.debug).toHaveBeenCalledWith('「進む」のジェスチャーを実行');
        });
    });
}); 