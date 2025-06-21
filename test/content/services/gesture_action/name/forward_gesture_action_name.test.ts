import { ForwardGestureActionName } from '../../../../../src/content/services/gesture_action/name/forward_gesture_action_name';

describe('ForwardGestureActionName', () => {
    let forwardGestureActionName: ForwardGestureActionName;

    beforeEach(() => {
        forwardGestureActionName = new ForwardGestureActionName();
    });

    test('getJapaneseName()は"進む"を返す', () => {
        const result = forwardGestureActionName.getJapaneseName();
        expect(result).toBe('進む');
    });
}); 