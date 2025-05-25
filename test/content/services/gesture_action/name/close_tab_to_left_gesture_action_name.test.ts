import { CloseTabToLeftGestureActionName } from '../../../../../src/content/services/gesture_action/name/close_tab_to_left_gesture_action_name';

describe('CloseTabToLeftGestureActionName', () => {
    let closeTabToLeftGestureActionName: CloseTabToLeftGestureActionName;

    beforeEach(() => {
        closeTabToLeftGestureActionName = new CloseTabToLeftGestureActionName();
    });

    test('getJapaneseName()は"このタブを閉じて左のタブに移動"を返す', () => {
        const result = closeTabToLeftGestureActionName.getJapaneseName();
        expect(result).toBe('このタブを閉じて左のタブに移動');
    });
}); 