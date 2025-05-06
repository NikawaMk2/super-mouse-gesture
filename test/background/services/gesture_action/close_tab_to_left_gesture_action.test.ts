import { CloseTabToLeftGestureAction } from '../../../../src/background/services/gesture_action/close_tab_to_left_gesture_action';
import { ITabOperator } from '../../../../src/common/provider/tab_operator';

describe('CloseTabToLeftGestureAction', () => {
    let tabOperatorMock: jest.Mocked<ITabOperator>;
    let action: CloseTabToLeftGestureAction;

    beforeEach(() => {
        tabOperatorMock = {
            createTab: jest.fn(),
            updateCurrentTab: jest.fn(),
            switchToNextTab: jest.fn(),
            switchToPrevTab: jest.fn(),
            togglePinActiveTab: jest.fn(),
            toggleMuteActiveTab: jest.fn(),
            closeActiveTab: jest.fn(),
            closeTabsToRight: jest.fn(),
            closeTabsToLeft: jest.fn().mockResolvedValue(undefined),
            duplicateActiveTab: jest.fn(),
            reopenClosedTab: jest.fn(),
        };
        action = new CloseTabToLeftGestureAction(tabOperatorMock);
    });

    it('tabOperator.closeTabsToLeftが呼ばれること', async () => {
        await action.execute();
        expect(tabOperatorMock.closeTabsToLeft).toHaveBeenCalled();
    });
}); 