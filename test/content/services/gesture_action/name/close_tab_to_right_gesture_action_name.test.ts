import { CloseTabToRightGestureActionName } from '../../../../../src/content/services/gesture_action/name/close_tab_to_right_gesture_action_name';

describe('CloseTabToRightGestureActionName', () => {
    let closeTabToRightGestureActionName: CloseTabToRightGestureActionName;

    beforeEach(() => {
        closeTabToRightGestureActionName = new CloseTabToRightGestureActionName();
    });

    test('getJapaneseName()は"このタブを閉じて右のタブに移動"を返す', () => {
        const result = closeTabToRightGestureActionName.getJapaneseName();
        expect(result).toBe('このタブを閉じて右のタブに移動');
    });
}); 