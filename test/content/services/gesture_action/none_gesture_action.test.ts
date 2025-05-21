import { NoneGestureAction } from '../../../../src/content/services/gesture_action/none_gesture_action';
import Logger from '../../../../src/common/logger/logger';

describe('NoneGestureAction', () => {
    it('executeを呼ぶとLogger.debugが呼ばれること', async () => {
        const debugSpy = jest.spyOn(Logger, 'debug').mockImplementation();
        const action = new NoneGestureAction();
        const payload = { actionName: 'none', params: { foo: 'bar' } };
        await action.execute(payload);
        expect(debugSpy).toHaveBeenCalledWith('NoneGestureAction: execute() が呼び出されました', { payload });
        debugSpy.mockRestore();
    });
}); 