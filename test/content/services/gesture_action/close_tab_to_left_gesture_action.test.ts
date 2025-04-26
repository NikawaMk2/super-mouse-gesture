/**
 * @jest-environment jsdom
 */
import { CloseTabToLeftGestureAction } from '../../../../src/content/services/gesture_action/close_tab_to_left_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { MessageSender } from '../../../../src/content/services/message/message_sender';

describe('CloseTabToLeftGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: MessageSender = { sendMessage: mockSendMessage };
        const action = new CloseTabToLeftGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            action: 'executeGestureAction',
            payload: {
                actionName: 'closeTabToLeft',
                params: {}
            }
        });
        expect(mockLogger).toHaveBeenCalledWith('CloseTabToLeftGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 