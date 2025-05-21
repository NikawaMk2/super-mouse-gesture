/**
 * @jest-environment jsdom
 */
import { SearchImageGoogleDragAction } from '../../../../../src/content/services/super_drag_action/image/search_image_google_drag_action';
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

describe('SearchImageGoogleDragAction', () => {
    beforeEach(() => {
        messageSenderMock.sendDragAction.mockClear();
        loggerDebugMock.mockClear();
        loggerWarnMock.mockClear();
        loggerErrorMock.mockClear();
        loggerInfoMock.mockClear();
    });

    it('imageUrl指定時はmessageSender.sendDragActionが呼ばれること', async () => {
        const action = new SearchImageGoogleDragAction(messageSenderMock);
        await action.execute({
            type: 'image',
            direction: 'right',
            actionName: 'searchImageGoogle',
            params: {},
            selectedValue: 'https://example.com/image.png',
        });
        expect(messageSenderMock.sendDragAction).toHaveBeenCalledWith(expect.objectContaining({
            type: 'image',
            direction: 'right',
            actionName: 'searchImageGoogle',
            selectedValue: 'https://example.com/image.png',
            params: expect.objectContaining({ searchUrl: expect.stringContaining('https://www.google.com/searchbyimage?image_url=') })
        }));
        expect(loggerDebugMock).toHaveBeenCalled();
        expect(loggerInfoMock).toHaveBeenCalled();
    });

    it('imageUrl未指定時はmessageSender.sendDragActionされず警告ログが出ること', async () => {
        const action = new SearchImageGoogleDragAction(messageSenderMock);
        await action.execute({
            type: 'image',
            direction: 'right',
            actionName: 'searchImageGoogle',
            params: {},
            selectedValue: '',
        });
        expect(messageSenderMock.sendDragAction).not.toHaveBeenCalled();
        expect(loggerWarnMock).toHaveBeenCalled();
    });
}); 