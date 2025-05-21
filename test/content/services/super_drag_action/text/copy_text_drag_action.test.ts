import { CopyTextDragAction } from '../../../../../src/content/services/super_drag_action/text/copy_text_drag_action';

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

describe('CopyTextDragAction', () => {
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

    it('executeでclipboard.writeTextが呼ばれinfoログも出ること', async () => {
        const action = new CopyTextDragAction();
        await action.execute({
            type: 'text',
            direction: 'left',
            actionName: 'copyText',
            params: {},
            selectedValue: 'コピー内容',
        });
        expect(writeTextMock).toHaveBeenCalledWith('コピー内容');
        expect(loggerDebugMock).toHaveBeenCalled();
    });

    it('text未指定時はclipboard.writeTextされず警告ログが出ること', async () => {
        const action = new CopyTextDragAction();
        await action.execute({
            type: 'text',
            direction: 'left',
            actionName: 'copyText',
            params: {},
            selectedValue: '',
        });
        expect(writeTextMock).not.toHaveBeenCalled();
        expect(loggerWarnMock).toHaveBeenCalled();
    });
}); 