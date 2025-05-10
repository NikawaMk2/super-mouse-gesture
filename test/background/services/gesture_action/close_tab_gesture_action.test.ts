import { CloseTabGestureAction } from '../../../../src/background/services/gesture_action/close_tab_gesture_action';
import { ITabOperator } from '../../../../src/common/provider/tab_operator';

describe('CloseTabGestureAction', () => {
    let tabOperatorMock: jest.Mocked<ITabOperator>;
    let action: CloseTabGestureAction;

    beforeEach(() => {
        tabOperatorMock = {
            createTab: jest.fn(),
            updateCurrentTab: jest.fn(),
            switchToNextTab: jest.fn(),
            switchToPrevTab: jest.fn(),
            togglePinActiveTab: jest.fn(),
            toggleMuteActiveTab: jest.fn(),
            closeActiveTab: jest.fn().mockResolvedValue(undefined),
            duplicateActiveTab: jest.fn(),
            reopenClosedTab: jest.fn(),
            activateLeftAndCloseActiveTab: jest.fn(),
            activateRightAndCloseActiveTab: jest.fn(),
        };
        action = new CloseTabGestureAction(tabOperatorMock);
    });

    it('tabOperator.closeActiveTabが呼ばれること', async () => {
        await action.execute();
        expect(tabOperatorMock.closeActiveTab).toHaveBeenCalled();
    });
}); 