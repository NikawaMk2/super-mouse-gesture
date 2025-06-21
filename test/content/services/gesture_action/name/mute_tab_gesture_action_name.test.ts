import { MuteTabGestureActionName } from '../../../../../src/content/services/gesture_action/name/mute_tab_gesture_action_name';

describe('MuteTabGestureActionName', () => {
    let muteTabGestureActionName: MuteTabGestureActionName;

    beforeEach(() => {
        muteTabGestureActionName = new MuteTabGestureActionName();
    });

    test('getJapaneseName()は"タブをミュート"を返す', () => {
        const result = muteTabGestureActionName.getJapaneseName();
        expect(result).toBe('タブをミュート');
    });
}); 