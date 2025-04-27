/**
 * @jest-environment jsdom
 */
import { MuteTabGestureAction } from '../../../../src/content/services/gesture_action/mute_tab_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { IGestureActionMessageSender } from '../../../../src/content/services/message/message_sender';

describe('MuteTabGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: IGestureActionMessageSender = { sendGestureAction: mockSendMessage } as any;
        const action = new MuteTabGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            actionName: 'muteTab',
            params: {}
    });
        expect(mockLogger).toHaveBeenCalledWith('MuteTabGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 