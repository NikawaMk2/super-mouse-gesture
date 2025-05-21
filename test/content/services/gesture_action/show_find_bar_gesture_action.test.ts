/**
 * @jest-environment jsdom
 */
import { ShowFindBarGestureAction } from '../../../../src/content/services/gesture_action/show_find_bar_gesture_action';

jest.mock('../../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: { debug: jest.fn() }
}));
import Logger from '../../../../src/common/logger/logger';

describe('ShowFindBarGestureAction', () => {
    it('execute()がwindow.find("")を呼び出す', () => {
        (window as any).find = jest.fn();
        const action = new ShowFindBarGestureAction();
        action.execute();
        expect((window as any).find).toHaveBeenCalledWith('');
        expect(Logger.debug).toHaveBeenCalledWith('ShowFindBarGestureAction: execute() が呼び出されました');
    });
}); 