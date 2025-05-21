/**
 * @jest-environment jsdom
 */
import { PrevTabGestureAction } from '../../../../src/content/services/gesture_action/prev_tab_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { IGestureActionMessageSender } from '../../../../src/content/services/message/message_sender';

describe('PrevTabGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: IGestureActionMessageSender = { sendGestureAction: mockSendMessage } as any;
        const action = new PrevTabGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            actionName: 'prevTab',
            params: {}
    });
        expect(mockLogger).toHaveBeenCalledWith('PrevTabGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 