/**
 * @jest-environment jsdom
 */
import { ScrollToTopGestureAction } from '../../../../src/content/services/gesture_action/scroll_to_top_gesture_action';

jest.mock('../../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: { debug: jest.fn() }
}));
import Logger from '../../../../src/common/logger/logger';

describe('ScrollToTopGestureAction', () => {
    it('execute()がwindow.scrollTo({top:0,behavior:"smooth"})を呼び出す', () => {
        const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
        const action = new ScrollToTopGestureAction();
        action.execute();
        expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
        expect(Logger.debug).toHaveBeenCalledWith('ScrollToTopGestureAction: execute() が呼び出されました');
        scrollToSpy.mockRestore();
    });
}); 