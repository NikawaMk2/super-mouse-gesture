/**
 * @jest-environment jsdom
 */
import { NewIncognitoWindowGestureAction } from '../../../../src/content/services/gesture_action/new_incognito_window_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { MessageSender } from '../../../../src/content/services/message/message_sender';

describe('NewIncognitoWindowGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: MessageSender = { sendMessage: mockSendMessage };
        const action = new NewIncognitoWindowGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            action: 'executeGestureAction',
            payload: {
                actionName: 'newIncognitoWindow',
                params: {}
            }
        });
        expect(mockLogger).toHaveBeenCalledWith('NewIncognitoWindowGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 