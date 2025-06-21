import { DuplicateTabGestureActionName } from '../../../../../src/content/services/gesture_action/name/duplicate_tab_gesture_action_name';

describe('DuplicateTabGestureActionName', () => {
    let duplicateTabGestureActionName: DuplicateTabGestureActionName;

    beforeEach(() => {
        duplicateTabGestureActionName = new DuplicateTabGestureActionName();
    });

    test('getJapaneseName()は"タブを複製"を返す', () => {
        const result = duplicateTabGestureActionName.getJapaneseName();
        expect(result).toBe('タブを複製');
    });
}); 