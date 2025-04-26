/**
 * @jest-environment jsdom
 */
import { NewTabGestureAction } from '../../../../src/content/services/gesture_action/new_tab_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { MessageSender } from '../../../../src/content/services/message/message_sender';

describe('NewTabGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: MessageSender = { sendMessage: mockSendMessage };
        const action = new NewTabGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            action: 'executeGestureAction',
            payload: {
                actionName: 'newTab',
                params: {}
            }
        });
        expect(mockLogger).toHaveBeenCalledWith('NewTabGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 