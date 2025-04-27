/**
 * @jest-environment jsdom
 */
import { DuplicateTabGestureAction } from '../../../../src/content/services/gesture_action/duplicate_tab_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { IGestureActionMessageSender } from '../../../../src/content/services/message/message_sender';

describe('DuplicateTabGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: IGestureActionMessageSender = { sendGestureAction: mockSendMessage } as any;
        const action = new DuplicateTabGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            actionName: 'duplicateTab',
            params: {}
    });
        expect(mockLogger).toHaveBeenCalledWith('DuplicateTabGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 