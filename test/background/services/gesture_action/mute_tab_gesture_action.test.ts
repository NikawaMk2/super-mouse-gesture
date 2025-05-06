import { MuteTabGestureAction } from '../../../../src/background/services/gesture_action/mute_tab_gesture_action';
import { ITabOperator } from '../../../../src/common/provider/tab_operator';

describe('MuteTabGestureAction', () => {
    let tabOperatorMock: jest.Mocked<ITabOperator>;
    let action: MuteTabGestureAction;

    beforeEach(() => {
        tabOperatorMock = {
            createTab: jest.fn(),
            updateCurrentTab: jest.fn(),
            switchToNextTab: jest.fn(),
            switchToPrevTab: jest.fn(),
            togglePinActiveTab: jest.fn(),
            toggleMuteActiveTab: jest.fn().mockResolvedValue(undefined),
            closeActiveTab: jest.fn(),
            closeTabsToRight: jest.fn(),
            closeTabsToLeft: jest.fn(),
            duplicateActiveTab: jest.fn(),
            reopenClosedTab: jest.fn(),
        };
        action = new MuteTabGestureAction(tabOperatorMock);
    });

    it('tabOperator.toggleMuteActiveTabが呼ばれること', async () => {
        await action.execute();
        expect(tabOperatorMock.toggleMuteActiveTab).toHaveBeenCalled();
    });
}); 