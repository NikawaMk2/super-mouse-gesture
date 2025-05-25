import { ReopenClosedTabGestureActionName } from '../../../../../src/content/services/gesture_action/name/reopen_closed_tab_gesture_action_name';

describe('ReopenClosedTabGestureActionName', () => {
    let reopenClosedTabGestureActionName: ReopenClosedTabGestureActionName;

    beforeEach(() => {
        reopenClosedTabGestureActionName = new ReopenClosedTabGestureActionName();
    });

    test('getJapaneseName()は"閉じたタブを再開"を返す', () => {
        const result = reopenClosedTabGestureActionName.getJapaneseName();
        expect(result).toBe('閉じたタブを再開');
    });
}); 