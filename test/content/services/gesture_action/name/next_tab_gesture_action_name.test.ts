import { NextTabGestureActionName } from '../../../../../src/content/services/gesture_action/name/next_tab_gesture_action_name';

describe('NextTabGestureActionName', () => {
    let nextTabGestureActionName: NextTabGestureActionName;

    beforeEach(() => {
        nextTabGestureActionName = new NextTabGestureActionName();
    });

    test('getJapaneseName()は"次のタブ"を返す', () => {
        const result = nextTabGestureActionName.getJapaneseName();
        expect(result).toBe('次のタブ');
    });
}); 