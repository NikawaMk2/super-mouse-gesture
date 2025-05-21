/**
 * @jest-environment jsdom
 */
import { CloseTabGestureAction } from '../../../../src/content/services/gesture_action/close_tab_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { IGestureActionMessageSender } from '../../../../src/content/services/message/message_sender';

describe('CloseTabGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', async () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: IGestureActionMessageSender = { sendGestureAction: mockSendMessage } as any;
        const action = new CloseTabGestureAction(messageSender);
        await action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            actionName: 'closeTab',
            params: {}
        });
        expect(mockLogger).toHaveBeenCalledWith('CloseTabGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 