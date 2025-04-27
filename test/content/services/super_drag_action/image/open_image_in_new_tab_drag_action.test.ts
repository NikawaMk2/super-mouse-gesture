/**
 * @jest-environment jsdom
 */
import { OpenImageInNewTabDragAction } from '../../../../../src/content/services/super_drag_action/image/open_image_in_new_tab_drag_action';

const openMock = jest.fn();
const loggerDebugMock = jest.fn();
const loggerWarnMock = jest.fn();
jest.mock('../../../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: {
        debug: (...args: any[]) => loggerDebugMock(...args),
        warn: (...args: any[]) => loggerWarnMock(...args),
    },
}));

describe('OpenImageInNewTabDragAction', () => {
    beforeAll(() => {
        // @ts-ignore
        global.window.open = openMock;
    });
    beforeEach(() => {
        openMock.mockClear();
        loggerDebugMock.mockClear();
        loggerWarnMock.mockClear();
    });

    it('url指定時はwindow.openが呼ばれること', async () => {
        const action = new OpenImageInNewTabDragAction();
        await action.execute({
            type: 'image',
            direction: 'up',
            actionName: 'openImageInNewTab',
            params: { url: 'https://example.com/image.png' },
        });
        expect(openMock).toHaveBeenCalledWith('https://example.com/image.png', '_blank');
        expect(loggerDebugMock).toHaveBeenCalled();
    });

    it('url未指定時はwindow.openされず警告ログが出ること', async () => {
        const action = new OpenImageInNewTabDragAction();
        await action.execute({
            type: 'image',
            direction: 'up',
            actionName: 'openImageInNewTab',
            params: {},
        });
        expect(openMock).not.toHaveBeenCalled();
        expect(loggerWarnMock).toHaveBeenCalled();
    });
}); 