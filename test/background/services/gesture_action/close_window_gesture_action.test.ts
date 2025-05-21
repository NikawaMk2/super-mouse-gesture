import { CloseWindowGestureAction } from '../../../../src/background/services/gesture_action/close_window_gesture_action';
import { IWindowOperator } from '../../../../src/background/services/gesture_action/i_window_operator';

describe('CloseWindowGestureAction', () => {
    let windowOperatorMock: jest.Mocked<IWindowOperator>;
    let action: CloseWindowGestureAction;

    beforeEach(() => {
        windowOperatorMock = {
            maximizeCurrentWindow: jest.fn(),
            minimizeCurrentWindow: jest.fn(),
            toggleFullscreenCurrentWindow: jest.fn(),
            createNewWindow: jest.fn(),
            createNewIncognitoWindow: jest.fn(),
            closeCurrentWindow: jest.fn().mockResolvedValue(undefined),
        };
        action = new CloseWindowGestureAction(windowOperatorMock);
    });

    it('windowOperator.closeCurrentWindowが呼ばれること', async () => {
        await action.execute();
        expect(windowOperatorMock.closeCurrentWindow).toHaveBeenCalled();
    });
}); 