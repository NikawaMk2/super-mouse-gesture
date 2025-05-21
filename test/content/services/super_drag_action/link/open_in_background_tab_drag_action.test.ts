import { OpenInBackgroundTabDragAction } from '../../../../../src/content/services/super_drag_action/link/open_in_background_tab_drag_action';
jest.mock('../../../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: {
        debug: jest.fn(),
        warn: jest.fn(),
    },
}));
import Logger from '../../../../../src/common/logger/logger';

describe('OpenInBackgroundTabDragAction', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('url指定時はsendDragActionが呼ばれる', async () => {
        const sender = { sendDragAction: jest.fn().mockResolvedValue({ result: 'ok' }) };
        const action = new OpenInBackgroundTabDragAction(sender as any);
        const url = 'https://example.com';
        const options = {
            type: 'link' as const,
            direction: 'up' as const,
            actionName: 'openInBackground',
            params: {},
            selectedValue: url,
        };
        await action.execute(options);
        expect(typeof sender.sendDragAction).toBe('function');
        expect(sender.sendDragAction).toHaveBeenCalledWith({ ...options, openType: 'background' });
        expect(Logger.debug).toHaveBeenCalled();
    });

    it('url未指定時はwarnログが出てsendDragActionされない', async () => {
        const sender = { sendDragAction: jest.fn() };
        const action = new OpenInBackgroundTabDragAction(sender as any);
        const options = {
            type: 'link' as const,
            direction: 'up' as const,
            actionName: 'openInBackground',
            params: {},
            selectedValue: '',
        };
        await action.execute(options);
        expect(Logger.warn).toHaveBeenCalled();
        expect(sender.sendDragAction).not.toHaveBeenCalled();
    });
}); 