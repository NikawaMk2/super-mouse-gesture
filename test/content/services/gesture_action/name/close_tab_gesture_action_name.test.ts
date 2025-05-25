import { CloseTabGestureActionName } from '../../../../../src/content/services/gesture_action/name/close_tab_gesture_action_name';

describe('CloseTabGestureActionName', () => {
    let closeTabGestureActionName: CloseTabGestureActionName;

    beforeEach(() => {
        closeTabGestureActionName = new CloseTabGestureActionName();
    });

    test('getJapaneseName()は"タブを閉じる"を返す', () => {
        const result = closeTabGestureActionName.getJapaneseName();
        expect(result).toBe('タブを閉じる');
    });
}); 