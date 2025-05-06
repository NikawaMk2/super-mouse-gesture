import { ToggleFullscreenGestureAction } from '../../../../src/background/services/gesture_action/toggle_fullscreen_gesture_action';
import { IWindowOperator } from '../../../../src/background/services/gesture_action/i_window_operator';

describe('ToggleFullscreenGestureAction', () => {
    let windowOperatorMock: jest.Mocked<IWindowOperator>;
    let action: ToggleFullscreenGestureAction;

    beforeEach(() => {
        windowOperatorMock = {
            maximizeCurrentWindow: jest.fn(),
            minimizeCurrentWindow: jest.fn(),
            toggleFullscreenCurrentWindow: jest.fn().mockResolvedValue(undefined),
            createNewWindow: jest.fn(),
            createNewIncognitoWindow: jest.fn(),
            closeCurrentWindow: jest.fn(),
        };
        action = new ToggleFullscreenGestureAction(windowOperatorMock);
    });

    it('windowOperator.toggleFullscreenCurrentWindowが呼ばれること', async () => {
        await action.execute();
        expect(windowOperatorMock.toggleFullscreenCurrentWindow).toHaveBeenCalled();
    });
}); 