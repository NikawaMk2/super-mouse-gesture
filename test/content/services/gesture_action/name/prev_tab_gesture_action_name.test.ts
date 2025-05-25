import { PrevTabGestureActionName } from '../../../../../src/content/services/gesture_action/name/prev_tab_gesture_action_name';

describe('PrevTabGestureActionName', () => {
    let prevTabGestureActionName: PrevTabGestureActionName;

    beforeEach(() => {
        prevTabGestureActionName = new PrevTabGestureActionName();
    });

    test('getJapaneseName()は"前のタブ"を返す', () => {
        const result = prevTabGestureActionName.getJapaneseName();
        expect(result).toBe('前のタブ');
    });
}); 