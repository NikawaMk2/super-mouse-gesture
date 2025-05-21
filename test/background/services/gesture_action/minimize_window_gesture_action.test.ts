import { MinimizeWindowGestureAction } from '../../../../src/background/services/gesture_action/minimize_window_gesture_action';
import { IWindowOperator } from '../../../../src/background/services/gesture_action/i_window_operator';

describe('MinimizeWindowGestureAction', () => {
    let windowOperatorMock: jest.Mocked<IWindowOperator>;
    let action: MinimizeWindowGestureAction;

    beforeEach(() => {
        windowOperatorMock = {
            maximizeCurrentWindow: jest.fn(),
            minimizeCurrentWindow: jest.fn().mockResolvedValue(undefined),
            toggleFullscreenCurrentWindow: jest.fn(),
            createNewWindow: jest.fn(),
            createNewIncognitoWindow: jest.fn(),
            closeCurrentWindow: jest.fn(),
        };
        action = new MinimizeWindowGestureAction(windowOperatorMock);
    });

    it('windowOperator.minimizeCurrentWindowが呼ばれること', async () => {
        await action.execute();
        expect(windowOperatorMock.minimizeCurrentWindow).toHaveBeenCalled();
    });
}); 