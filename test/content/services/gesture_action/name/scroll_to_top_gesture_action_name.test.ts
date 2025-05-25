import { ScrollToTopGestureActionName } from '../../../../../src/content/services/gesture_action/name/scroll_to_top_gesture_action_name';

describe('ScrollToTopGestureActionName', () => {
    let scrollToTopGestureActionName: ScrollToTopGestureActionName;

    beforeEach(() => {
        scrollToTopGestureActionName = new ScrollToTopGestureActionName();
    });

    test('getJapaneseName()は"ページトップへ"を返す', () => {
        const result = scrollToTopGestureActionName.getJapaneseName();
        expect(result).toBe('ページトップへ');
    });
}); 