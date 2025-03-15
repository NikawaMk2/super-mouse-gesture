import { Container } from 'inversify';
import Logger from '../../../../src/common/utils/logger';
import ScrollTopGestureAction from '../../../../src/content/handlers/gesture_action/scroll_top_swipe_action';

describe('ScrollTopGestureActionクラスのテスト', () => {
    let action: ScrollTopGestureAction;
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

        // DIコンテナの設定
        const container = new Container();
        container.bind(ScrollTopGestureAction).toSelf();
        action = container.get(ScrollTopGestureAction);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('doActionメソッドのテスト', () => {
        it('ページトップへのスクロールが実行されること', () => {
            action.doAction();

            expect(mockScrollTo).toHaveBeenCalledTimes(1);
            expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
        });

        it('デバッグログが出力されること', () => {
            action.doAction();

            expect(mockLogger.debug).toHaveBeenCalledTimes(1);
            expect(mockLogger.debug).toHaveBeenCalledWith('「ページの一番上へ」のジェスチャーを実行');
        });
    });
}); 