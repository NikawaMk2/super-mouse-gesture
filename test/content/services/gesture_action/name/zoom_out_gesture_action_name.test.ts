import { ZoomOutGestureActionName } from '../../../../../src/content/services/gesture_action/name/zoom_out_gesture_action_name';

describe('ZoomOutGestureActionName', () => {
    let zoomOutGestureActionName: ZoomOutGestureActionName;

    beforeEach(() => {
        zoomOutGestureActionName = new ZoomOutGestureActionName();
    });

    test('getJapaneseName()は"ズームアウト"を返す', () => {
        const result = zoomOutGestureActionName.getJapaneseName();
        expect(result).toBe('ズームアウト');
    });
}); 