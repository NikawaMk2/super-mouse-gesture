/**
 * @jest-environment jsdom
 */
import { SearchImageGoogleDragAction } from '../../../../../src/content/services/super_drag_action/image/search_image_google_drag_action';
import { ChromeMessageSender } from '../../../../../src/content/services/message/message_sender';

const loggerDebugMock = jest.fn();
const loggerWarnMock = jest.fn();
jest.mock('../../../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: {
        debug: (...args: any[]) => loggerDebugMock(...args),
        warn: (...args: any[]) => loggerWarnMock(...args),
    },
}));

jest.mock('../../../../../src/content/services/message/message_sender');
const sendDragActionMock = jest.fn();
(ChromeMessageSender as jest.Mock).mockImplementation(() => ({
    sendDragAction: sendDragActionMock,
}));

describe('SearchImageGoogleDragAction', () => {
    let windowOpenSpy: jest.SpyInstance;
    beforeAll(() => {
        windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(jest.fn());
    });
    afterAll(() => {
        windowOpenSpy.mockRestore();
    });
    beforeEach(() => {
        sendDragActionMock.mockClear();
        loggerDebugMock.mockClear();
        loggerWarnMock.mockClear();
        windowOpenSpy.mockClear();
    });

    it('executeでwindow.openが呼ばれること', async () => {
        const action = new SearchImageGoogleDragAction();
        await action.execute({
            type: 'image',
            direction: 'right',
            actionName: 'searchImageGoogle',
            params: { imageUrl: 'https://example.com/image.png' },
        });
        expect(windowOpenSpy).toHaveBeenCalledWith(
            'https://www.google.com/searchbyimage?image_url=' + encodeURIComponent('https://example.com/image.png'),
            '_blank'
        );
        expect(loggerDebugMock).toHaveBeenCalled();
    });

    it('imageUrl未指定時はsendDragActionされず警告ログが出ること', async () => {
        const action = new SearchImageGoogleDragAction();
        await action.execute({
            type: 'image',
            direction: 'right',
            actionName: 'searchImageGoogle',
            params: {},
        });
        expect(sendDragActionMock).not.toHaveBeenCalled();
        expect(loggerWarnMock).toHaveBeenCalled();
    });
}); 