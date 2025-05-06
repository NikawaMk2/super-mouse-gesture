import { MaximizeWindowGestureAction } from '../../../../src/background/services/gesture_action/maximize_window_gesture_action';
import { IWindowOperator } from '../../../../src/background/services/gesture_action/i_window_operator';

describe('MaximizeWindowGestureAction', () => {
    let windowOperatorMock: jest.Mocked<IWindowOperator>;
    let action: MaximizeWindowGestureAction;

    beforeEach(() => {
        windowOperatorMock = {
            maximizeCurrentWindow: jest.fn().mockResolvedValue(undefined),
            minimizeCurrentWindow: jest.fn(),
            toggleFullscreenCurrentWindow: jest.fn(),
            createNewWindow: jest.fn(),
            createNewIncognitoWindow: jest.fn(),
            closeCurrentWindow: jest.fn(),
        };
        action = new MaximizeWindowGestureAction(windowOperatorMock);
    });

    it('windowOperator.maximizeCurrentWindowが呼ばれること', async () => {
        await action.execute();
        expect(windowOperatorMock.maximizeCurrentWindow).toHaveBeenCalled();
    });
}); 