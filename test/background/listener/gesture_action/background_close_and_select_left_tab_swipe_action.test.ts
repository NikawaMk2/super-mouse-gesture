import 'reflect-metadata';
import { Container } from 'inversify';
import BackgroundCloseAndSelectLeftTabGestureAction from '../../../../src/background/listener/gesture_action/background_close_and_select_left_tab_swipe_action';
import { ChromeTabOperator } from '../../../../src/background/services/chrome_tab_operator';
import { TYPES } from '../../../../src/common/utils/container_provider';
import Logger from '../../../../src/common/utils/logger';

// ContainerProviderのモックを設定
jest.mock('../../../../src/common/utils/container_provider', () => ({
    __esModule: true,
    TYPES: {
        ChromeTabOperator: Symbol.for('ChromeTabOperator')
    }
}));

describe('BackgroundCloseAndSelectLeftTabGestureActionクラスのテスト', () => {
    const mockChromeTabOperator: ChromeTabOperator = {
        getCurrentWindowTabs: jest.fn(),
        activateTab: jest.fn(),
        removeTab: jest.fn(),
        activateRightTab: jest.fn(),
        activateLeftTab: jest.fn(),
        activateRightTabAndCloseCurrentTab: jest.fn(),
        activateLeftTabAndCloseCurrentTab: jest.fn()
    };

    let container: Container;
    let action: BackgroundCloseAndSelectLeftTabGestureAction;
    let mockLogger: jest.Mocked<typeof Logger>;

    beforeEach(() => {
        // Loggerのモック化
        jest.spyOn(Logger, 'debug').mockImplementation(jest.fn());
        jest.spyOn(Logger, 'error').mockImplementation(jest.fn());
        mockLogger = Logger as jest.Mocked<typeof Logger>;

        container = new Container();
        container.bind<ChromeTabOperator>(TYPES.ChromeTabOperator).toConstantValue(mockChromeTabOperator);
        container.bind(BackgroundCloseAndSelectLeftTabGestureAction).toSelf();
        action = container.get(BackgroundCloseAndSelectLeftTabGestureAction);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('doActionメソッドのテスト', () => {
        it('タブIDが存在する場合、左のタブを選択して現在のタブを閉じる', async () => {
            const sender = {
                tab: { id: 123 }
            };

            await action.doAction(sender as chrome.runtime.MessageSender);

            expect(mockChromeTabOperator.activateLeftTabAndCloseCurrentTab).toHaveBeenCalledWith(123);
            expect(mockLogger.debug).toHaveBeenCalledWith('バックグラウンドで「このタブを閉じて左のタブを選択」のジェスチャーを実行');
        });

        it('タブIDが存在しない場合、何もしない', async () => {
            const sender = {
                tab: undefined
            };

            await action.doAction(sender as chrome.runtime.MessageSender);

            expect(mockChromeTabOperator.activateLeftTabAndCloseCurrentTab).not.toHaveBeenCalled();
            expect(mockLogger.error).toHaveBeenCalledWith('タブ情報が見つかりません。このアクションはタブのコンテンツスクリプトからのみ実行可能です。');
        });
    });
}); 