import { DownloadImageDragAction } from '../../../../../src/content/services/super_drag_action/image/download_image_drag_action';
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

describe('DownloadImageDragAction', () => {
    beforeEach(() => {
        sendDragActionMock.mockClear();
        loggerDebugMock.mockClear();
        loggerWarnMock.mockClear();
    });

    it('executeでsendDragActionが呼ばれること', async () => {
        const action = new DownloadImageDragAction();
        await action.execute({
            type: 'image',
            direction: 'down',
            actionName: 'downloadImage',
            params: {},
            selectedValue: 'https://example.com/image.png',
        });
        expect(sendDragActionMock).toHaveBeenCalledWith(expect.objectContaining({ openType: 'downloadImage' }));
        expect(loggerDebugMock).toHaveBeenCalled();
    });

    it('url未指定時はsendDragActionされず警告ログが出ること', async () => {
        const action = new DownloadImageDragAction();
        await action.execute({
            type: 'image',
            direction: 'down',
            actionName: 'downloadImage',
            params: {},
            selectedValue: '',
        });
        expect(sendDragActionMock).not.toHaveBeenCalled();
        expect(loggerWarnMock).toHaveBeenCalled();
    });
}); 