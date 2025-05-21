import { PrevTabGestureAction } from '../../../../src/background/services/gesture_action/prev_tab_gesture_action';
import { ITabOperator } from '../../../../src/common/provider/tab_operator';

describe('PrevTabGestureAction', () => {
    let tabOperatorMock: jest.Mocked<ITabOperator>;
    let action: PrevTabGestureAction;

    beforeEach(() => {
        tabOperatorMock = {
            createTab: jest.fn(),
            updateCurrentTab: jest.fn(),
            switchToNextTab: jest.fn(),
            switchToPrevTab: jest.fn().mockResolvedValue(undefined),
            togglePinActiveTab: jest.fn(),
            toggleMuteActiveTab: jest.fn(),
            closeActiveTab: jest.fn(),
            duplicateActiveTab: jest.fn(),
            reopenClosedTab: jest.fn(),
            activateLeftAndCloseActiveTab: jest.fn(),
            activateRightAndCloseActiveTab: jest.fn(),
        };
        action = new PrevTabGestureAction(tabOperatorMock);
    });

    it('tabOperator.switchToPrevTabが呼ばれること', async () => {
        await action.execute();
        expect(tabOperatorMock.switchToPrevTab).toHaveBeenCalled();
    });
}); 