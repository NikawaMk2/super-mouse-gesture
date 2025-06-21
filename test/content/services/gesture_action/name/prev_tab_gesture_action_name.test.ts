import { PrevTabGestureActionName } from '../../../../../src/content/services/gesture_action/name/prev_tab_gesture_action_name';

describe('PrevTabGestureActionName', () => {
    let prevTabGestureActionName: PrevTabGestureActionName;

    beforeEach(() => {
        prevTabGestureActionName = new PrevTabGestureActionName();
    });

    test('getJapaneseName()は"左のタブに移動"を返す', () => {
        const result = prevTabGestureActionName.getJapaneseName();
        expect(result).toBe('左のタブに移動');
    });
}); 