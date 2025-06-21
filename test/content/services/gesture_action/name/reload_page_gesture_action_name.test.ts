import { ReloadPageGestureActionName } from '../../../../../src/content/services/gesture_action/name/reload_page_gesture_action_name';

describe('ReloadPageGestureActionName', () => {
    let reloadPageGestureActionName: ReloadPageGestureActionName;

    beforeEach(() => {
        reloadPageGestureActionName = new ReloadPageGestureActionName();
    });

    test('getJapaneseName()は"再読み込み"を返す', () => {
        const result = reloadPageGestureActionName.getJapaneseName();
        expect(result).toBe('再読み込み');
    });
}); 