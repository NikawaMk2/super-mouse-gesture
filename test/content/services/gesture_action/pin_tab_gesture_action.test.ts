/**
 * @jest-environment jsdom
 */
import { PinTabGestureAction } from '../../../../src/content/services/gesture_action/pin_tab_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { MessageSender } from '../../../../src/content/services/message/message_sender';

describe('PinTabGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: MessageSender = { sendMessage: mockSendMessage };
        const action = new PinTabGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            action: 'executeGestureAction',
            payload: {
                actionName: 'pinTab',
                params: {}
            }
        });
        expect(mockLogger).toHaveBeenCalledWith('PinTabGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 