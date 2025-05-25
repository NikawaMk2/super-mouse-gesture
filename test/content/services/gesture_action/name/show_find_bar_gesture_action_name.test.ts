import { ShowFindBarGestureActionName } from '../../../../../src/content/services/gesture_action/name/show_find_bar_gesture_action_name';

describe('ShowFindBarGestureActionName', () => {
    let showFindBarGestureActionName: ShowFindBarGestureActionName;

    beforeEach(() => {
        showFindBarGestureActionName = new ShowFindBarGestureActionName();
    });

    test('getJapaneseName()は"検索バー表示"を返す', () => {
        const result = showFindBarGestureActionName.getJapaneseName();
        expect(result).toBe('検索バー表示');
    });
}); 