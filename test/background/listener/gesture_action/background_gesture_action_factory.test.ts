import 'reflect-metadata';
import { BackgroundGestureActionFactory } from '../../../../src/background/listener/gesture_action/background_gesture_action_factory';
import { BackgroundMessage } from '../../../../src/common/messaging/types/background_message_type';
import BackgroundSelectRightTabGestureAction from '../../../../src/background/listener/gesture_action/background_select_right_tab_swipe_action';
import BackgroundSelectLeftTabGestureAction from '../../../../src/background/listener/gesture_action/background_select_left_tab_swipe_action';
import BackgroundCloseAndSelectRightTabGestureAction from '../../../../src/background/listener/gesture_action/background_close_and_select_right_tab_swipe_action';
import BackgroundCloseAndSelectLeftTabGestureAction from '../../../../src/background/listener/gesture_action/background_close_and_select_left_tab_swipe_action';
import ContainerProvider from '../../../../src/common/utils/container_provider';
import { ChromeTabOperator } from '../../../../src/background/services/chrome_tab_operator';

jest.mock('../../../../src/common/utils/container_provider');

describe('BackgroundGestureActionFactoryクラスのテスト', () => {
    const mockContainer = {
        get: jest.fn()
    };

    const mockChromeTabOperator: ChromeTabOperator = {
        getCurrentWindowTabs: jest.fn(),
        activateTab: jest.fn(),
        removeTab: jest.fn(),
        activateRightTab: jest.fn(),
        activateLeftTab: jest.fn(),
        activateRightTabAndCloseCurrentTab: jest.fn(),
        activateLeftTabAndCloseCurrentTab: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (ContainerProvider.getBackgroundContainer as jest.Mock).mockReturnValue(mockContainer);
    });

    it('SelectRightTabのアクションを作成する', () => {
        const mockAction = new BackgroundSelectRightTabGestureAction(mockChromeTabOperator);
        mockContainer.get.mockReturnValue(mockAction);

        const result = BackgroundGestureActionFactory.createGestureAction(BackgroundMessage.SelectRightTab);

        expect(mockContainer.get).toHaveBeenCalledWith(BackgroundSelectRightTabGestureAction);
        expect(result).toBe(mockAction);
    });

    it('SelectLeftTabのアクションを作成する', () => {
        const mockAction = new BackgroundSelectLeftTabGestureAction(mockChromeTabOperator);
        mockContainer.get.mockReturnValue(mockAction);

        const result = BackgroundGestureActionFactory.createGestureAction(BackgroundMessage.SelectLeftTab);

        expect(mockContainer.get).toHaveBeenCalledWith(BackgroundSelectLeftTabGestureAction);
        expect(result).toBe(mockAction);
    });

    it('CloseAndSelectRightTabのアクションを作成する', () => {
        const mockAction = new BackgroundCloseAndSelectRightTabGestureAction(mockChromeTabOperator);
        mockContainer.get.mockReturnValue(mockAction);

        const result = BackgroundGestureActionFactory.createGestureAction(BackgroundMessage.CloseAndSelectRightTab);

        expect(mockContainer.get).toHaveBeenCalledWith(BackgroundCloseAndSelectRightTabGestureAction);
        expect(result).toBe(mockAction);
    });

    it('CloseAndSelectLeftTabのアクションを作成する', () => {
        const mockAction = new BackgroundCloseAndSelectLeftTabGestureAction(mockChromeTabOperator);
        mockContainer.get.mockReturnValue(mockAction);

        const result = BackgroundGestureActionFactory.createGestureAction(BackgroundMessage.CloseAndSelectLeftTab);

        expect(mockContainer.get).toHaveBeenCalledWith(BackgroundCloseAndSelectLeftTabGestureAction);
        expect(result).toBe(mockAction);
    });
}); 