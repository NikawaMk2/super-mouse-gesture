import { CloseTabToRightGestureAction } from '../../../../src/background/services/gesture_action/close_tab_to_right_gesture_action';
import { ITabOperator } from '../../../../src/common/provider/tab_operator';

describe('CloseTabToRightGestureAction', () => {
    let tabOperatorMock: jest.Mocked<ITabOperator>;
    let action: CloseTabToRightGestureAction;

    beforeEach(() => {
        tabOperatorMock = {
            createTab: jest.fn(),
            updateCurrentTab: jest.fn(),
            switchToNextTab: jest.fn(),
            switchToPrevTab: jest.fn(),
            togglePinActiveTab: jest.fn(),
            toggleMuteActiveTab: jest.fn(),
            closeActiveTab: jest.fn(),
            duplicateActiveTab: jest.fn(),
            reopenClosedTab: jest.fn(),
            activateRightAndCloseActiveTab: jest.fn().mockResolvedValue(undefined),
            activateLeftAndCloseActiveTab: jest.fn(),
        };
        action = new CloseTabToRightGestureAction(tabOperatorMock);
    });

    it('tabOperator.activateRightAndCloseActiveTabが呼ばれること', async () => {
        await action.execute();
        expect(tabOperatorMock.activateRightAndCloseActiveTab).toHaveBeenCalled();
    });
}); 