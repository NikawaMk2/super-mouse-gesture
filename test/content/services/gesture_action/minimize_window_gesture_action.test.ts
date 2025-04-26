/**
 * @jest-environment jsdom
 */
import { MinimizeWindowGestureAction } from '../../../../src/content/services/gesture_action/minimize_window_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { MessageSender } from '../../../../src/content/services/message/message_sender';

describe('MinimizeWindowGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: MessageSender = { sendMessage: mockSendMessage };
        const action = new MinimizeWindowGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            action: 'executeGestureAction',
            payload: {
                actionName: 'minimizeWindow',
                params: {}
            }
        });
        expect(mockLogger).toHaveBeenCalledWith('MinimizeWindowGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 