import { ReopenClosedTabGestureAction } from '../../../../src/background/services/gesture_action/reopen_closed_tab_gesture_action';
import { ITabOperator } from '../../../../src/common/provider/tab_operator';

describe('ReopenClosedTabGestureAction', () => {
    let tabOperatorMock: jest.Mocked<ITabOperator>;
    let action: ReopenClosedTabGestureAction;

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
            duplicateActiveTab: jest.fn(),
            reopenClosedTab: jest.fn().mockResolvedValue(undefined),
        };
        action = new ReopenClosedTabGestureAction(tabOperatorMock);
    });

    it('tabOperator.reopenClosedTabが呼ばれること', async () => {
        await action.execute();
        expect(tabOperatorMock.reopenClosedTab).toHaveBeenCalled();
    });
}); 