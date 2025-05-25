import { MinimizeWindowGestureActionName } from '../../../../../src/content/services/gesture_action/name/minimize_window_gesture_action_name';

describe('MinimizeWindowGestureActionName', () => {
    let minimizeWindowGestureActionName: MinimizeWindowGestureActionName;

    beforeEach(() => {
        minimizeWindowGestureActionName = new MinimizeWindowGestureActionName();
    });

    test('getJapaneseName()は"ウィンドウを最小化"を返す', () => {
        const result = minimizeWindowGestureActionName.getJapaneseName();
        expect(result).toBe('ウィンドウを最小化');
    });
}); 