import { ZoomInGestureActionName } from '../../../../../src/content/services/gesture_action/name/zoom_in_gesture_action_name';

describe('ZoomInGestureActionName', () => {
    let zoomInGestureActionName: ZoomInGestureActionName;

    beforeEach(() => {
        zoomInGestureActionName = new ZoomInGestureActionName();
    });

    test('getJapaneseName()は"ズームイン"を返す', () => {
        const result = zoomInGestureActionName.getJapaneseName();
        expect(result).toBe('ズームイン');
    });
}); 