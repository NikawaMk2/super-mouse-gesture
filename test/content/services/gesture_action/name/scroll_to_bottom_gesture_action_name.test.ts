import { ScrollToBottomGestureActionName } from '../../../../../src/content/services/gesture_action/name/scroll_to_bottom_gesture_action_name';

describe('ScrollToBottomGestureActionName', () => {
    let scrollToBottomGestureActionName: ScrollToBottomGestureActionName;

    beforeEach(() => {
        scrollToBottomGestureActionName = new ScrollToBottomGestureActionName();
    });

    test('getJapaneseName()は"ページ末尾へ"を返す', () => {
        const result = scrollToBottomGestureActionName.getJapaneseName();
        expect(result).toBe('ページ末尾へ');
    });
}); 