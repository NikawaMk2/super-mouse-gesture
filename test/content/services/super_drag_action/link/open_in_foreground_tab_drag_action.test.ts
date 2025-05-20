import { OpenInForegroundTabDragAction } from '../../../../../src/content/services/super_drag_action/link/open_in_foreground_tab_drag_action';
jest.mock('../../../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: {
        debug: jest.fn(),
        warn: jest.fn(),
    },
}));
import Logger from '../../../../../src/common/logger/logger';

describe('OpenInForegroundTabDragAction', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('url指定時はsendDragActionが呼ばれる', async () => {
        const sender = { sendDragAction: jest.fn().mockResolvedValue({ result: 'ok' }) };
        const action = new OpenInForegroundTabDragAction(sender as any);
        const url = 'https://example.com';
        const options = {
            type: 'link' as const,
            direction: 'right' as const,
            actionName: 'open',
            params: {},
            selectedValue: url,
        };
        await action.execute(options);
        expect(typeof sender.sendDragAction).toBe('function');
        expect(sender.sendDragAction).toHaveBeenCalledWith({ ...options, openType: 'foreground' });
        expect(Logger.debug).toHaveBeenCalled();
    });

    it('url未指定時はwarnログが出てsendDragActionされない', async () => {
        const sender = { sendDragAction: jest.fn() };
        const action = new OpenInForegroundTabDragAction(sender as any);
        const options = {
            type: 'link' as const,
            direction: 'right' as const,
            actionName: 'open',
            params: {},
            selectedValue: '',
        };
        await action.execute(options);
        expect(Logger.warn).toHaveBeenCalled();
        expect(sender.sendDragAction).not.toHaveBeenCalled();
    });
});
