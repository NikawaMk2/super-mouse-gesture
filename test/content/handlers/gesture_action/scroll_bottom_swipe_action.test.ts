import { Container } from 'inversify';
import Logger from '../../../../src/common/utils/logger';
import ScrollBottomGestureAction from '../../../../src/content/handlers/gesture_action/scroll_bottom_swipe_action';

describe('ScrollBottomGestureActionクラスのテスト', () => {
    let action: ScrollBottomGestureAction;
    let mockLogger: jest.Mocked<typeof Logger>;
    let mockScrollTo: jest.SpyInstance;

    beforeAll(() => {
        // DOMの初期化
        document.documentElement.innerHTML = '<html><body></body></html>';
    });

    beforeEach(() => {
        // Loggerのモック化
        jest.spyOn(Logger, 'debug').mockImplementation(jest.fn());
        mockLogger = Logger as jest.Mocked<typeof Logger>;

        // window.scrollToのモック化
        mockScrollTo = jest.spyOn(window, 'scrollTo').mockImplementation(jest.fn());

        // documentのスクロール高さをモック
        Object.defineProperty(document.documentElement, 'scrollHeight', {
            value: 1000,
            configurable: true
        });

        // DIコンテナの設定
        const container = new Container();
        container.bind(ScrollBottomGestureAction).toSelf();
        action = container.get(ScrollBottomGestureAction);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('doActionメソッドのテスト', () => {
        it('ページ最下部へのスクロールが実行されること', () => {
            action.doAction();

            expect(mockScrollTo).toHaveBeenCalledTimes(1);
            expect(mockScrollTo).toHaveBeenCalledWith(0, 1000);
        });

        it('デバッグログが出力されること', () => {
            action.doAction();

            expect(mockLogger.debug).toHaveBeenCalledTimes(1);
            expect(mockLogger.debug).toHaveBeenCalledWith('「ページの一番下へ」のジェスチャーを実行');
        });
    });
}); 