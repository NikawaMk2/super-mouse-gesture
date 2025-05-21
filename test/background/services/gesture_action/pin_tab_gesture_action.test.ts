import { PinTabGestureAction } from '../../../../src/background/services/gesture_action/pin_tab_gesture_action';
import { ITabOperator } from '../../../../src/common/provider/tab_operator';

describe('PinTabGestureAction', () => {
    let tabOperatorMock: jest.Mocked<ITabOperator>;
    let action: PinTabGestureAction;

    beforeEach(() => {
        tabOperatorMock = {
            createTab: jest.fn(),
            updateCurrentTab: jest.fn(),
            switchToNextTab: jest.fn(),
            switchToPrevTab: jest.fn(),
            togglePinActiveTab: jest.fn().mockResolvedValue(undefined),
            toggleMuteActiveTab: jest.fn(),
            closeActiveTab: jest.fn(),
            duplicateActiveTab: jest.fn(),
            reopenClosedTab: jest.fn(),
            activateLeftAndCloseActiveTab: jest.fn(),
            activateRightAndCloseActiveTab: jest.fn(),
        };
        action = new PinTabGestureAction(tabOperatorMock);
    });

    it('tabOperator.togglePinActiveTabが呼ばれること', async () => {
        await action.execute();
        expect(tabOperatorMock.togglePinActiveTab).toHaveBeenCalled();
    });
}); 