/**
 * @jest-environment jsdom
 */
import { CloseWindowGestureAction } from '../../../../src/content/services/gesture_action/close_window_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { MessageSender } from '../../../../src/content/services/message/message_sender';

describe('CloseWindowGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: MessageSender = { sendMessage: mockSendMessage };
        const action = new CloseWindowGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            action: 'executeGestureAction',
            payload: {
                actionName: 'closeWindow',
                params: {}
            }
        });
        expect(mockLogger).toHaveBeenCalledWith('CloseWindowGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 