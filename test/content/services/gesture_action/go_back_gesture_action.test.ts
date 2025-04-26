/**
 * @jest-environment jsdom
 */
import { GoBackGestureAction } from '../../../../src/content/services/gesture_action/go_back_gesture_action';

describe('GoBackGestureAction', () => {
    it('execute()がwindow.history.back()を呼び出す', () => {
        const backSpy = jest.spyOn(window.history, 'back').mockImplementation(() => {});
        const action = new GoBackGestureAction();
        action.execute();
        expect(backSpy).toHaveBeenCalled();
        backSpy.mockRestore();
    });
}); 