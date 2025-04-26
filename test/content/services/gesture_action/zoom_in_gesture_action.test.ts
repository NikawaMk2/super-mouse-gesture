/**
 * @jest-environment jsdom
 */
import { ZoomInGestureAction } from '../../../../src/content/services/gesture_action/zoom_in_gesture_action';

jest.mock('../../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: { debug: jest.fn() }
}));
import Logger from '../../../../src/common/logger/logger';

describe('ZoomInGestureAction', () => {
    it('execute()がdocument.body.style.zoomを増加させる', () => {
        document.body.style.zoom = '1';
        const action = new ZoomInGestureAction();
        action.execute();
        expect(document.body.style.zoom).toBe('1.1');
        expect(Logger.debug).toHaveBeenCalledWith('ZoomInGestureAction: execute() が呼び出されました');
    });
}); 