/**
 * @jest-environment jsdom
 */
import { OpenImageInNewTabDragAction } from '../../../../../src/content/services/super_drag_action/image/open_image_in_new_tab_drag_action';
import { IDragActionMessageSender } from '../../../../../src/content/services/message/message_sender';
const messageSenderMock: jest.Mocked<IDragActionMessageSender> = {
    sendDragAction: jest.fn()
};
const loggerDebugMock = jest.fn();
const loggerWarnMock = jest.fn();
const loggerErrorMock = jest.fn();
const loggerInfoMock = jest.fn();
jest.mock('../../../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: {
        debug: (...args: any[]) => loggerDebugMock(...args),
        warn: (...args: any[]) => loggerWarnMock(...args),
        error: (...args: any[]) => loggerErrorMock(...args),
        info: (...args: any[]) => loggerInfoMock(...args),
    },
}));

describe('OpenImageInNewTabDragAction', () => {
    beforeEach(() => {
        messageSenderMock.sendDragAction.mockClear();
        loggerDebugMock.mockClear();
        loggerWarnMock.mockClear();
        loggerErrorMock.mockClear();
        loggerInfoMock.mockClear();
    });

    it('url指定時はmessageSender.sendDragActionが呼ばれること', async () => {
        const action = new OpenImageInNewTabDragAction(messageSenderMock);
        await action.execute({
            type: 'image',
            direction: 'up',
            actionName: 'openImageInNewTab',
            params: {},
            selectedValue: 'https://example.com/image.png',
        });
        expect(messageSenderMock.sendDragAction).toHaveBeenCalledWith({
            type: 'image',
            direction: 'up',
            actionName: 'openImageInNewTab',
            params: {},
            selectedValue: 'https://example.com/image.png',
        });
        expect(loggerDebugMock).toHaveBeenCalled();
    });

    it('url未指定時はmessageSender.sendDragActionされず警告ログが出ること', async () => {
        const action = new OpenImageInNewTabDragAction(messageSenderMock);
        await action.execute({
            type: 'image',
            direction: 'up',
            actionName: 'openImageInNewTab',
            params: {},
            selectedValue: '',
        });
        expect(messageSenderMock.sendDragAction).not.toHaveBeenCalled();
        expect(loggerWarnMock).toHaveBeenCalled();
    });
}); 