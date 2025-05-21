import { DownloadLinkDragAction } from '../../../../../src/content/services/super_drag_action/link/download_link_drag_action';
jest.mock('../../../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: {
        debug: jest.fn(),
        warn: jest.fn(),
    },
}));
import Logger from '../../../../../src/common/logger/logger';

describe('DownloadLinkDragAction', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('url指定時はsendDragActionが呼ばれる', async () => {
        const sender = { sendDragAction: jest.fn().mockResolvedValue({ result: 'ok' }) };
        const action = new DownloadLinkDragAction(sender as any);
        const url = 'https://example.com/file.zip';
        const options = {
            type: 'link' as const,
            direction: 'down' as const,
            actionName: 'download',
            params: {},
            selectedValue: url,
        };
        await action.execute(options);
        expect(typeof sender.sendDragAction).toBe('function');
        expect(sender.sendDragAction).toHaveBeenCalledWith({ ...options, openType: 'download' });
        expect(Logger.debug).toHaveBeenCalled();
    });

    it('url未指定時はwarnログが出てsendDragActionされない', async () => {
        const sender = { sendDragAction: jest.fn() };
        const action = new DownloadLinkDragAction(sender as any);
        const options = {
            type: 'link' as const,
            direction: 'down' as const,
            actionName: 'download',
            params: {},
            selectedValue: '',
        };
        await action.execute(options);
        expect(Logger.warn).toHaveBeenCalled();
        expect(sender.sendDragAction).not.toHaveBeenCalled();
    });
}); 