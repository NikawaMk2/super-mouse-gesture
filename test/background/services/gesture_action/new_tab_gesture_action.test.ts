import { NewTabGestureAction } from '../../../../src/background/services/gesture_action/new_tab_gesture_action';
import { ITabOperator } from '../../../../src/common/provider/tab_operator';

describe('NewTabGestureAction', () => {
    let tabOperatorMock: jest.Mocked<ITabOperator>;
    let action: NewTabGestureAction;

    beforeEach(() => {
        tabOperatorMock = {
            createTab: jest.fn().mockResolvedValue({ id: 123 }),
            updateCurrentTab: jest.fn(),
            switchToNextTab: jest.fn(),
            switchToPrevTab: jest.fn(),
            togglePinActiveTab: jest.fn(),
            toggleMuteActiveTab: jest.fn(),
            closeActiveTab: jest.fn(),
            closeTabsToRight: jest.fn(),
            closeTabsToLeft: jest.fn(),
            duplicateActiveTab: jest.fn(),
            reopenClosedTab: jest.fn(),
        };
        action = new NewTabGestureAction(tabOperatorMock);
    });

    it('tabOperator.createTabがchrome://newtab, trueで呼ばれること', async () => {
        await action.execute();
        expect(tabOperatorMock.createTab).toHaveBeenCalledWith('chrome://newtab', true);
    });
}); 