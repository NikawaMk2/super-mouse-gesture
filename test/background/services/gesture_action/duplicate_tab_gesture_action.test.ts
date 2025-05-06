import { DuplicateTabGestureAction } from '../../../../src/background/services/gesture_action/duplicate_tab_gesture_action';
import { ITabOperator } from '../../../../src/common/provider/tab_operator';

describe('DuplicateTabGestureAction', () => {
    let tabOperatorMock: jest.Mocked<ITabOperator>;
    let action: DuplicateTabGestureAction;

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
            closeTabsToLeft: jest.fn(),
            duplicateActiveTab: jest.fn().mockResolvedValue(undefined),
            reopenClosedTab: jest.fn(),
        };
        action = new DuplicateTabGestureAction(tabOperatorMock);
    });

    it('tabOperator.duplicateActiveTabが呼ばれること', async () => {
        await action.execute();
        expect(tabOperatorMock.duplicateActiveTab).toHaveBeenCalled();
    });
}); 