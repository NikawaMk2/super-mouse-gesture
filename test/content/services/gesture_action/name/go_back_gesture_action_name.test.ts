import { GoBackGestureActionName } from '../../../../../src/content/services/gesture_action/name/go_back_gesture_action_name';

describe('GoBackGestureActionName', () => {
    let goBackGestureActionName: GoBackGestureActionName;

    beforeEach(() => {
        goBackGestureActionName = new GoBackGestureActionName();
    });

    test('getJapaneseName()は"戻る"を返す', () => {
        const result = goBackGestureActionName.getJapaneseName();
        expect(result).toBe('戻る');
    });
}); 