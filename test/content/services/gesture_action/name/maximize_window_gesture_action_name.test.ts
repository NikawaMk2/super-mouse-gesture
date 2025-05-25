import { MaximizeWindowGestureActionName } from '../../../../../src/content/services/gesture_action/name/maximize_window_gesture_action_name';

describe('MaximizeWindowGestureActionName', () => {
    let maximizeWindowGestureActionName: MaximizeWindowGestureActionName;

    beforeEach(() => {
        maximizeWindowGestureActionName = new MaximizeWindowGestureActionName();
    });

    test('getJapaneseName()は"ウィンドウを最大化"を返す', () => {
        const result = maximizeWindowGestureActionName.getJapaneseName();
        expect(result).toBe('ウィンドウを最大化');
    });
}); 