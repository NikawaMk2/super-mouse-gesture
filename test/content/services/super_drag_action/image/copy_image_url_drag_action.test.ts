import { CopyImageUrlDragAction } from '../../../../../src/content/services/super_drag_action/image/copy_image_url_drag_action';

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

describe('CopyImageUrlDragAction', () => {
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
        const action = new CopyImageUrlDragAction();
        await action.execute({
            type: 'image',
            direction: 'left',
            actionName: 'copyImageUrl',
            params: {},
            selectedValue: 'https://example.com/image.png',
        });
        expect(writeTextMock).toHaveBeenCalledWith('https://example.com/image.png');
        expect(loggerDebugMock).toHaveBeenCalled();
    });

    it('url未指定時はclipboard.writeTextされず警告ログが出ること', async () => {
        const action = new CopyImageUrlDragAction();
        await action.execute({
            type: 'image',
            direction: 'left',
            actionName: 'copyImageUrl',
            params: {},
            selectedValue: '',
        });
        expect(writeTextMock).not.toHaveBeenCalled();
        expect(loggerWarnMock).toHaveBeenCalled();
    });

    it('clipboard.writeText失敗時はerrorログが出ること', async () => {
        writeTextMock.mockRejectedValueOnce(new Error('copy failed'));
        const action = new CopyImageUrlDragAction();
        await action.execute({
            type: 'image',
            direction: 'left',
            actionName: 'copyImageUrl',
            params: {},
            selectedValue: 'https://example.com/image.png',
        });
        expect(loggerErrorMock).toHaveBeenCalled();
    });
}); 