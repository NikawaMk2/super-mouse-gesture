import { NewWindowGestureAction } from '../../../../src/background/services/gesture_action/new_window_gesture_action';
import { IWindowOperator } from '../../../../src/background/services/gesture_action/i_window_operator';

describe('NewWindowGestureAction', () => {
    let windowOperatorMock: jest.Mocked<IWindowOperator>;
    let action: NewWindowGestureAction;

    beforeEach(() => {
        windowOperatorMock = {
            maximizeCurrentWindow: jest.fn(),
            minimizeCurrentWindow: jest.fn(),
            toggleFullscreenCurrentWindow: jest.fn(),
            createNewWindow: jest.fn().mockResolvedValue(undefined),
            createNewIncognitoWindow: jest.fn(),
            closeCurrentWindow: jest.fn(),
        };
        action = new NewWindowGestureAction(windowOperatorMock);
    });

    it('windowOperator.createNewWindowが呼ばれること', async () => {
        await action.execute();
        expect(windowOperatorMock.createNewWindow).toHaveBeenCalled();
    });
}); 