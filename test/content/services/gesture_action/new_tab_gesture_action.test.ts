/**
 * @jest-environment jsdom
 */
import { NewTabGestureAction } from '../../../../src/content/services/gesture_action/new_tab_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { IGestureActionMessageSender } from '../../../../src/content/services/message/message_sender';

describe('NewTabGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: IGestureActionMessageSender = { sendGestureAction: mockSendMessage } as any;
        const action = new NewTabGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            actionName: 'newTab',
            params: {}
    });
        expect(mockLogger).toHaveBeenCalledWith('NewTabGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 