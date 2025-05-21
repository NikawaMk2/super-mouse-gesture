/**
 * @jest-environment jsdom
 */
import { SearchGoogleDragAction } from '../../../../../src/content/services/super_drag_action/text/search_google_drag_action';
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

describe('SearchGoogleDragAction', () => {
    beforeEach(() => {
        messageSenderMock.sendDragAction.mockClear();
        loggerDebugMock.mockClear();
        loggerWarnMock.mockClear();
        loggerErrorMock.mockClear();
        loggerInfoMock.mockClear();
    });

    it('text指定時はmessageSender.sendDragActionが呼ばれること', async () => {
        const action = new SearchGoogleDragAction(messageSenderMock);
        await action.execute({
            type: 'text',
            direction: 'up',
            actionName: 'searchGoogle',
            params: {},
            selectedValue: 'テスト',
        });
        expect(messageSenderMock.sendDragAction).toHaveBeenCalledWith(expect.objectContaining({
            type: 'text',
            direction: 'up',
            actionName: 'searchGoogle',
            selectedValue: 'テスト',
            params: expect.objectContaining({
                searchUrl: 'https://www.google.com/search?q=%E3%83%86%E3%82%B9%E3%83%88'
            })
        }));
        expect(loggerDebugMock).toHaveBeenCalled();
        expect(loggerInfoMock).toHaveBeenCalled();
    });

    it('text未指定時はmessageSender.sendDragActionされず警告ログが出ること', async () => {
        const action = new SearchGoogleDragAction(messageSenderMock);
        await action.execute({
            type: 'text',
            direction: 'up',
            actionName: 'searchGoogle',
            params: {},
            selectedValue: '',
        });
        expect(messageSenderMock.sendDragAction).not.toHaveBeenCalled();
        expect(loggerWarnMock).toHaveBeenCalled();
    });
}); 