/**
 * @jest-environment jsdom
 */
import { ForwardGestureAction } from '../../../../src/content/services/gesture_action/forward_gesture_action';

// Loggerをモック
jest.mock('../../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: { debug: jest.fn() }
}));
import Logger from '../../../../src/common/logger/logger';

describe('ForwardGestureAction', () => {
    it('execute()がwindow.history.forward()を呼び出す', () => {
        const forwardSpy = jest.spyOn(window.history, 'forward').mockImplementation(() => {});
        const action = new ForwardGestureAction();
        action.execute();
        expect(forwardSpy).toHaveBeenCalled();
        expect(Logger.debug).toHaveBeenCalledWith('ForwardGestureAction: execute() が呼び出されました');
        forwardSpy.mockRestore();
    });
}); 