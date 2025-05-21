/**
 * @jest-environment jsdom
 */
import { ZoomOutGestureAction } from '../../../../src/content/services/gesture_action/zoom_out_gesture_action';

jest.mock('../../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: { debug: jest.fn() }
}));
import Logger from '../../../../src/common/logger/logger';

describe('ZoomOutGestureAction', () => {
    it('execute()がdocument.body.style.zoomを減少させる', () => {
        document.body.style.zoom = '1';
        const action = new ZoomOutGestureAction();
        action.execute();
        expect(document.body.style.zoom).toBe('0.9');
        expect(Logger.debug).toHaveBeenCalledWith('ZoomOutGestureAction: execute() が呼び出されました');
    });
}); 