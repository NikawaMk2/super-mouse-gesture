/**
 * @jest-environment jsdom
 */
import { MaximizeWindowGestureAction } from '../../../../src/content/services/gesture_action/maximize_window_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { IGestureActionMessageSender } from '../../../../src/content/services/message/message_sender';

describe('MaximizeWindowGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: IGestureActionMessageSender = { sendGestureAction: mockSendMessage } as any;
        const action = new MaximizeWindowGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            actionName: 'maximizeWindow',
            params: {}
    });
        expect(mockLogger).toHaveBeenCalledWith('MaximizeWindowGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 