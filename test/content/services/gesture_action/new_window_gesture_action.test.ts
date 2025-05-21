/**
 * @jest-environment jsdom
 */
import { NewWindowGestureAction } from '../../../../src/content/services/gesture_action/new_window_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { IGestureActionMessageSender } from '../../../../src/content/services/message/message_sender';

describe('NewWindowGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: IGestureActionMessageSender = { sendGestureAction: mockSendMessage } as any;
        const action = new NewWindowGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            actionName: 'newWindow',
            params: {}
    });
        expect(mockLogger).toHaveBeenCalledWith('NewWindowGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 