import { NoneGestureActionName } from '../../../../../src/content/services/gesture_action/name/none_gesture_action_name';

describe('NoneGestureActionName', () => {
    let noneGestureActionName: NoneGestureActionName;

    beforeEach(() => {
        noneGestureActionName = new NoneGestureActionName();
    });

    test('getJapaneseName()は"なし"を返す', () => {
        const result = noneGestureActionName.getJapaneseName();
        expect(result).toBe('なし');
    });
}); 