/**
 * @jest-environment jsdom
 */
import { PrevTabGestureAction } from '../../../../src/content/services/gesture_action/prev_tab_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { MessageSender } from '../../../../src/content/services/message/message_sender';

describe('PrevTabGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: MessageSender = { sendMessage: mockSendMessage };
        const action = new PrevTabGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            action: 'executeGestureAction',
            payload: {
                actionName: 'prevTab',
                params: {}
            }
        });
        expect(mockLogger).toHaveBeenCalledWith('PrevTabGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 