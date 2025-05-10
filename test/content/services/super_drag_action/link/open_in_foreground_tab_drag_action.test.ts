import { OpenInForegroundTabDragAction } from '../../../../../src/content/services/super_drag_action/link/open_in_foreground_tab_drag_action';
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

describe('OpenInForegroundTabDragAction', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('url指定時はsendDragActionが呼ばれる', async () => {
        const action = new OpenInForegroundTabDragAction();
        const url = 'https://example.com';
        const options = {
            type: 'link' as const,
            direction: 'right' as const,
            actionName: 'open',
            params: {},
            selectedValue: url,
        };
        await action.execute(options);
        const sender = (ChromeMessageSender as jest.Mock).mock.results[0]?.value;
        expect(typeof sender.sendDragAction).toBe('function');
        expect(sender.sendDragAction).toHaveBeenCalledWith({ ...options, openType: 'foreground' });
        expect(Logger.debug).toHaveBeenCalled();
    });

    it('url未指定時はwarnログが出てsendDragActionされない', async () => {
        const action = new OpenInForegroundTabDragAction();
        const options = {
            type: 'link' as const,
            direction: 'right' as const,
            actionName: 'open',
            params: {},
            selectedValue: '',
        };
        await action.execute(options);
        expect(Logger.warn).toHaveBeenCalled();
        expect(ChromeMessageSender).not.toHaveBeenCalled();
    });
});
