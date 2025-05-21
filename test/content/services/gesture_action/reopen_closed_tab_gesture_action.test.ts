/**
 * @jest-environment jsdom
 */
import { ReopenClosedTabGestureAction } from '../../../../src/content/services/gesture_action/reopen_closed_tab_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { IGestureActionMessageSender } from '../../../../src/content/services/message/message_sender';

describe('ReopenClosedTabGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: IGestureActionMessageSender = { sendGestureAction: mockSendMessage } as any;
        const action = new ReopenClosedTabGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            actionName: 'reopenClosedTab',
            params: {}
    });
        expect(mockLogger).toHaveBeenCalledWith('ReopenClosedTabGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 