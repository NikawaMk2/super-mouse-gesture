import { NewWindowGestureActionName } from '../../../../../src/content/services/gesture_action/name/new_window_gesture_action_name';

describe('NewWindowGestureActionName', () => {
    let newWindowGestureActionName: NewWindowGestureActionName;

    beforeEach(() => {
        newWindowGestureActionName = new NewWindowGestureActionName();
    });

    test('getJapaneseName()は"新しいウィンドウを開く"を返す', () => {
        const result = newWindowGestureActionName.getJapaneseName();
        expect(result).toBe('新しいウィンドウを開く');
    });
}); 