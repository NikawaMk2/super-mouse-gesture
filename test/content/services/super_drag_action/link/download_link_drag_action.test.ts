import { DownloadLinkDragAction } from '../../../../../src/content/services/super_drag_action/link/download_link_drag_action';
jest.mock('../../../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: {
        debug: jest.fn(),
        warn: jest.fn(),
    },
}));
jest.mock('../../../../../src/content/services/message/message_sender', () => {
    return {
        ChromeMessageSender: jest.fn().mockImplementation(() => {
            return {
                sendDragAction: jest.fn().mockResolvedValue({ result: 'ok' })
            };
        }),
    };
});
import Logger from '../../../../../src/common/logger/logger';
import { ChromeMessageSender } from '../../../../../src/content/services/message/message_sender';

describe('DownloadLinkDragAction', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('url指定時はsendDragActionが呼ばれる', async () => {
        const action = new DownloadLinkDragAction();
        const url = 'https://example.com/file.zip';
        const options = {
            type: 'link' as const,
            direction: 'down' as const,
            actionName: 'download',
            params: { url },
        };
        await action.execute(options);
        expect(ChromeMessageSender).toHaveBeenCalled();
        const sender = (ChromeMessageSender as jest.Mock).mock.results[0]?.value;
        expect(typeof sender.sendDragAction).toBe('function');
        expect(sender.sendDragAction).toHaveBeenCalledWith({ ...options, openType: 'download' });
        expect(Logger.debug).toHaveBeenCalled();
    });

    it('url未指定時はwarnログが出てsendDragActionされない', async () => {
        const action = new DownloadLinkDragAction();
        const options = {
            type: 'link' as const,
            direction: 'down' as const,
            actionName: 'download',
            params: {},
        };
        await action.execute(options);
        expect(Logger.warn).toHaveBeenCalled();
        expect(ChromeMessageSender).not.toHaveBeenCalled();
    });
}); 