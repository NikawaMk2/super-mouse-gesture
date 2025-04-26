/**
 * @jest-environment jsdom
 */
import { NextTabGestureAction } from '../../../../src/content/services/gesture_action/next_tab_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { MessageSender } from '../../../../src/content/services/message/message_sender';

describe('NextTabGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: MessageSender = { sendMessage: mockSendMessage };
        const action = new NextTabGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            action: 'executeGestureAction',
            payload: {
                actionName: 'nextTab',
                params: {}
            }
        });
        expect(mockLogger).toHaveBeenCalledWith('NextTabGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 