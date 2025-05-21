/**
 * @jest-environment jsdom
 */
import { NewIncognitoWindowGestureAction } from '../../../../src/content/services/gesture_action/new_incognito_window_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { IGestureActionMessageSender } from '../../../../src/content/services/message/message_sender';

describe('NewIncognitoWindowGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: IGestureActionMessageSender = { sendGestureAction: mockSendMessage } as any;
        const action = new NewIncognitoWindowGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            actionName: 'newIncognitoWindow',
            params: {}
    });
        expect(mockLogger).toHaveBeenCalledWith('NewIncognitoWindowGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 