import { NewIncognitoWindowGestureAction } from '../../../../src/background/services/gesture_action/new_incognito_window_gesture_action';
import { IWindowOperator } from '../../../../src/background/services/gesture_action/i_window_operator';

describe('NewIncognitoWindowGestureAction', () => {
    let windowOperatorMock: jest.Mocked<IWindowOperator>;
    let action: NewIncognitoWindowGestureAction;

    beforeEach(() => {
        windowOperatorMock = {
            maximizeCurrentWindow: jest.fn(),
            minimizeCurrentWindow: jest.fn(),
            toggleFullscreenCurrentWindow: jest.fn(),
            createNewWindow: jest.fn(),
            createNewIncognitoWindow: jest.fn().mockResolvedValue(undefined),
            closeCurrentWindow: jest.fn(),
        };
        action = new NewIncognitoWindowGestureAction(windowOperatorMock);
    });

    it('windowOperator.createNewIncognitoWindowが呼ばれること', async () => {
        await action.execute();
        expect(windowOperatorMock.createNewIncognitoWindow).toHaveBeenCalled();
    });
}); 