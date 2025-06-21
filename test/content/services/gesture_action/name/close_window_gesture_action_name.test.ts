import { CloseWindowGestureActionName } from '../../../../../src/content/services/gesture_action/name/close_window_gesture_action_name';

describe('CloseWindowGestureActionName', () => {
    let closeWindowGestureActionName: CloseWindowGestureActionName;

    beforeEach(() => {
        closeWindowGestureActionName = new CloseWindowGestureActionName();
    });

    test('getJapaneseName()は"ウィンドウを閉じる"を返す', () => {
        const result = closeWindowGestureActionName.getJapaneseName();
        expect(result).toBe('ウィンドウを閉じる');
    });
}); 