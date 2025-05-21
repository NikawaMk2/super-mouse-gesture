/**
 * @jest-environment jsdom
 */
import { CloseTabToRightGestureAction } from '../../../../src/content/services/gesture_action/close_tab_to_right_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { IGestureActionMessageSender } from '../../../../src/content/services/message/message_sender';

describe('CloseTabToRightGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: IGestureActionMessageSender = { sendGestureAction: mockSendMessage } as any;
        const action = new CloseTabToRightGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            actionName: 'closeTabToRight',
            params: {}
    });
        expect(mockLogger).toHaveBeenCalledWith('CloseTabToRightGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 