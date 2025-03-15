import { Container } from 'inversify';
import Logger from '../../../../src/common/utils/logger';
import ScrollUpGestureAction from '../../../../src/content/handlers/gesture_action/scroll_up_swipe_action';

describe('ScrollUpGestureActionクラスのテスト', () => {
    let action: ScrollUpGestureAction;
    let mockLogger: jest.Mocked<typeof Logger>;
    let mockScrollBy: jest.SpyInstance;

    beforeAll(() => {
        // DOMの初期化
        document.documentElement.innerHTML = '<html><body></body></html>';
    });

    beforeEach(() => {
        // Loggerのモック化
        jest.spyOn(Logger, 'debug').mockImplementation(jest.fn());
        mockLogger = Logger as jest.Mocked<typeof Logger>;

        // window.scrollByのモック化
        mockScrollBy = jest.spyOn(window, 'scrollBy').mockImplementation(jest.fn());

        // window.innerHeightをモック
        Object.defineProperty(window, 'innerHeight', {
            value: 800,
            configurable: true
        });

        // DIコンテナの設定
        const container = new Container();
        container.bind(ScrollUpGestureAction).toSelf();
        action = container.get(ScrollUpGestureAction);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('doActionメソッドのテスト', () => {
        it('1画面分上へのスクロールが実行されること', () => {
            action.doAction();

            expect(mockScrollBy).toHaveBeenCalledTimes(1);
            expect(mockScrollBy).toHaveBeenCalledWith(0, 800);
        });

        it('デバッグログが出力されること', () => {
            action.doAction();

            expect(mockLogger.debug).toHaveBeenCalledTimes(1);
            expect(mockLogger.debug).toHaveBeenCalledWith('「上へスクロール」のジェスチャーを実行');
        });
    });
}); 