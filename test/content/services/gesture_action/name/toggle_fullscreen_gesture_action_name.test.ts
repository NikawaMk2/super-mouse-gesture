import { ToggleFullscreenGestureActionName } from '../../../../../src/content/services/gesture_action/name/toggle_fullscreen_gesture_action_name';

describe('ToggleFullscreenGestureActionName', () => {
    let toggleFullscreenGestureActionName: ToggleFullscreenGestureActionName;

    beforeEach(() => {
        toggleFullscreenGestureActionName = new ToggleFullscreenGestureActionName();
    });

    test('getJapaneseName()は"フルスクリーンモードを切り替える"を返す', () => {
        const result = toggleFullscreenGestureActionName.getJapaneseName();
        expect(result).toBe('フルスクリーンモードを切り替える');
    });
}); 