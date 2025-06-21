/**
 * @jest-environment jsdom
 */
import { ScrollToBottomGestureAction } from '../../../../src/content/services/gesture_action/scroll_to_bottom_gesture_action';

jest.mock('../../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: { debug: jest.fn() }
}));
import Logger from '../../../../src/common/logger/logger';

describe('ScrollToBottomGestureAction', () => {
    it('execute()がwindow.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})を呼び出す', () => {
        const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
        // document.body.scrollHeightをモック
        Object.defineProperty(document.body, 'scrollHeight', { value: 1234, configurable: true });
        const action = new ScrollToBottomGestureAction();
        action.execute();
        expect(scrollToSpy).toHaveBeenCalledWith({ top: 1234, behavior: 'auto' });
        expect(Logger.debug).toHaveBeenCalledWith('ScrollToBottomGestureAction: execute() が呼び出されました');
        scrollToSpy.mockRestore();
    });
}); 