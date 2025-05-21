/**
 * @jest-environment jsdom
 */
import { OpenAsUrlDragAction } from '../../../../../src/content/services/super_drag_action/text/open_as_url_drag_action';
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

describe('OpenAsUrlDragAction', () => {
    beforeEach(() => {
        messageSenderMock.sendDragAction.mockClear();
        loggerDebugMock.mockClear();
        loggerWarnMock.mockClear();
        loggerErrorMock.mockClear();
        loggerInfoMock.mockClear();
    });

    it('text指定時はmessageSender.sendDragActionが呼ばれること（newTab=true）', async () => {
        const action = new OpenAsUrlDragAction(messageSenderMock);
        await action.execute({
            type: 'text',
            direction: 'down',
            actionName: 'openAsUrl',
            params: { newTab: true },
            selectedValue: 'example.com',
        });
        expect(messageSenderMock.sendDragAction).toHaveBeenCalledWith(expect.objectContaining({
            type: 'text',
            direction: 'down',
            actionName: 'openAsUrl',
            selectedValue: 'example.com',
            params: expect.objectContaining({
                newTab: true,
                url: 'http://example.com'
            })
        }));
        expect(loggerDebugMock).toHaveBeenCalled();
        expect(loggerInfoMock).toHaveBeenCalled();
    });

    it('text指定時はmessageSender.sendDragActionが呼ばれること（newTab=false）', async () => {
        const action = new OpenAsUrlDragAction(messageSenderMock);
        await action.execute({
            type: 'text',
            direction: 'down',
            actionName: 'openAsUrl',
            params: { newTab: false },
            selectedValue: 'example.com',
        });
        expect(messageSenderMock.sendDragAction).toHaveBeenCalledWith(expect.objectContaining({
            type: 'text',
            direction: 'down',
            actionName: 'openAsUrl',
            selectedValue: 'example.com',
            params: expect.objectContaining({
                newTab: false,
                url: 'http://example.com'
            })
        }));
        expect(loggerDebugMock).toHaveBeenCalled();
        expect(loggerInfoMock).toHaveBeenCalled();
    });

    it('text未指定時はmessageSender.sendDragActionされず警告ログが出ること', async () => {
        const action = new OpenAsUrlDragAction(messageSenderMock);
        await action.execute({
            type: 'text',
            direction: 'down',
            actionName: 'openAsUrl',
            params: {},
            selectedValue: '',
        });
        expect(messageSenderMock.sendDragAction).not.toHaveBeenCalled();
        expect(loggerWarnMock).toHaveBeenCalled();
    });
}); 