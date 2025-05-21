import { CopyLinkUrlDragAction } from '../../../../../src/content/services/super_drag_action/link/copy_link_url_drag_action';
const writeTextMock = jest.fn();
const loggerDebugMock = jest.fn();
const loggerWarnMock = jest.fn();
const loggerInfoMock = jest.fn();
const loggerErrorMock = jest.fn();
jest.mock('../../../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: {
        debug: (...args: any[]) => loggerDebugMock(...args),
        warn: (...args: any[]) => loggerWarnMock(...args),
        info: (...args: any[]) => loggerInfoMock(...args),
        error: (...args: any[]) => loggerErrorMock(...args),
    },
}));
import Logger from '../../../../../src/common/logger/logger';

describe('CopyLinkUrlDragAction', () => {
    beforeAll(() => {
        // @ts-ignore
        global.navigator.clipboard = { writeText: writeTextMock };
    });
    beforeEach(() => {
        writeTextMock.mockClear();
        loggerDebugMock.mockClear();
        loggerWarnMock.mockClear();
        loggerInfoMock.mockClear();
        loggerErrorMock.mockClear();
    });

    it('url指定時はclipboard.writeTextとdebugログが呼ばれること', async () => {
        const action = new CopyLinkUrlDragAction();
        await action.execute({
            type: 'link',
            direction: 'left',
            actionName: 'copyLinkUrl',
            params: {},
            selectedValue: 'https://example.com/link',
        });
        expect(writeTextMock).toHaveBeenCalledWith('https://example.com/link');
        expect(loggerDebugMock).toHaveBeenCalled();
    });

    it('url未指定時はclipboard.writeTextされず警告ログが出ること', async () => {
        const action = new CopyLinkUrlDragAction();
        await action.execute({
            type: 'link',
            direction: 'left',
            actionName: 'copyLinkUrl',
            params: {},
            selectedValue: '',
        });
        expect(writeTextMock).not.toHaveBeenCalled();
        expect(loggerWarnMock).toHaveBeenCalled();
    });

    it('clipboard.writeText失敗時はerrorログが出ること', async () => {
        writeTextMock.mockRejectedValueOnce(new Error('copy failed'));
        const action = new CopyLinkUrlDragAction();
        await action.execute({
            type: 'link',
            direction: 'left',
            actionName: 'copyLinkUrl',
            params: {},
            selectedValue: 'https://example.com/link',
        });
        expect(loggerErrorMock).toHaveBeenCalled();
    });
}); 