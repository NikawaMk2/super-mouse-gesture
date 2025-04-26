/**
 * @jest-environment jsdom
 */
import { StopLoadingGestureAction } from '../../../../src/content/services/gesture_action/stop_loading_gesture_action';

jest.mock('../../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: { debug: jest.fn() }
}));
import Logger from '../../../../src/common/logger/logger';

describe('StopLoadingGestureAction', () => {
    it('execute()がwindow.stop()を呼び出す', () => {
        const stopSpy = jest.spyOn(window, 'stop').mockImplementation(() => {});
        const action = new StopLoadingGestureAction();
        action.execute();
        expect(stopSpy).toHaveBeenCalled();
        expect(Logger.debug).toHaveBeenCalledWith('StopLoadingGestureAction: execute() が呼び出されました');
        stopSpy.mockRestore();
    });
}); 