import { PinTabGestureActionName } from '../../../../../src/content/services/gesture_action/name/pin_tab_gesture_action_name';

describe('PinTabGestureActionName', () => {
    let pinTabGestureActionName: PinTabGestureActionName;

    beforeEach(() => {
        pinTabGestureActionName = new PinTabGestureActionName();
    });

    test('getJapaneseName()は"タブをピン留め"を返す', () => {
        const result = pinTabGestureActionName.getJapaneseName();
        expect(result).toBe('タブをピン留め');
    });
}); 