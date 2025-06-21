import { NewTabGestureActionName } from '../../../../../src/content/services/gesture_action/name/new_tab_gesture_action_name';

describe('NewTabGestureActionName', () => {
    let newTabGestureActionName: NewTabGestureActionName;

    beforeEach(() => {
        newTabGestureActionName = new NewTabGestureActionName();
    });

    test('getJapaneseName()は"新しいタブ"を返す', () => {
        const result = newTabGestureActionName.getJapaneseName();
        expect(result).toBe('新しいタブ');
    });
}); 