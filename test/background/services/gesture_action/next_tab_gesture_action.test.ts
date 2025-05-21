import { NextTabGestureAction } from '../../../../src/background/services/gesture_action/next_tab_gesture_action';
import { ITabOperator } from '../../../../src/common/provider/tab_operator';

describe('NextTabGestureAction', () => {
    let tabOperatorMock: jest.Mocked<ITabOperator>;
    let action: NextTabGestureAction;

    beforeEach(() => {
        tabOperatorMock = {
            createTab: jest.fn(),
            updateCurrentTab: jest.fn(),
            switchToNextTab: jest.fn().mockResolvedValue(undefined),
            switchToPrevTab: jest.fn(),
            togglePinActiveTab: jest.fn(),
            toggleMuteActiveTab: jest.fn(),
            closeActiveTab: jest.fn(),
            duplicateActiveTab: jest.fn(),
            reopenClosedTab: jest.fn(),
            activateLeftAndCloseActiveTab: jest.fn(),
            activateRightAndCloseActiveTab: jest.fn(),
        };
        action = new NextTabGestureAction(tabOperatorMock);
    });

    it('tabOperator.switchToNextTabが呼ばれること', async () => {
        await action.execute();
        expect(tabOperatorMock.switchToNextTab).toHaveBeenCalled();
    });
}); 