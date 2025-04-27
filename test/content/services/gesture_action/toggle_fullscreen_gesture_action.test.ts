/**
 * @jest-environment jsdom
 */
import { ToggleFullscreenGestureAction } from '../../../../src/content/services/gesture_action/toggle_fullscreen_gesture_action';
import Logger from '../../../../src/common/logger/logger';
import { IGestureActionMessageSender } from '../../../../src/content/services/message/message_sender';

describe('ToggleFullscreenGestureAction', () => {
    it('execute()がMessageSender.sendMessageとLogger.debugを呼び出す', () => {
        const mockSendMessage = jest.fn();
        const mockLogger = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
        const messageSender: IGestureActionMessageSender = { sendGestureAction: mockSendMessage } as any;
        const action = new ToggleFullscreenGestureAction(messageSender);
        action.execute();
        expect(mockSendMessage).toHaveBeenCalledWith({
            actionName: 'toggleFullscreen',
            params: {}
    });
        expect(mockLogger).toHaveBeenCalledWith('ToggleFullscreenGestureAction: execute() が呼び出されました');
        mockLogger.mockRestore();
    });
}); 