/**
 * @jest-environment jsdom
 */
import { CloseTabGestureAction } from '../../../../src/content/services/gesture_action/close_tab_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { MessageSender } from '../../../../src/content/services/message/message_sender';

describe('CloseTabGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: MessageSender = { sendMessage: mockSendMessage };
        const action = new CloseTabGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            action: 'executeGestureAction',
            payload: {
                actionName: 'closeTab',
                params: {}
            }
        });
        expect(mockLogger).toHaveBeenCalledWith('CloseTabGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 