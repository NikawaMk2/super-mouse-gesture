import { Container } from 'inversify';
import Logger from '../../../../src/common/utils/logger';
import NoAction from '../../../../src/content/handlers/gesture_action/no_action';

describe('NoActionクラスのテスト', () => {
    let action: NoAction;
    let mockLogger: jest.Mocked<typeof Logger>;

    beforeEach(() => {
        // Loggerのモック化
        jest.spyOn(Logger, 'debug').mockImplementation(jest.fn());
        mockLogger = Logger as jest.Mocked<typeof Logger>;

        // DIコンテナの設定
        const container = new Container();
        container.bind(NoAction).toSelf();
        action = container.get(NoAction);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('doActionメソッドのテスト', () => {
        it('デバッグログのみが出力されること', () => {
            action.doAction();

            expect(mockLogger.debug).toHaveBeenCalledTimes(1);
            expect(mockLogger.debug).toHaveBeenCalledWith('実行ジェスチャ無し');
        });
    });
}); 