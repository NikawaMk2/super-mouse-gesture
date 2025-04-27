/**
 * @jest-environment jsdom
 */
import { OpenAsUrlDragAction } from '../../../../../src/content/services/super_drag_action/text/open_as_url_drag_action';

const openMock = jest.fn();
const locationAssignMock = jest.fn();
const loggerDebugMock = jest.fn();
const loggerWarnMock = jest.fn();
jest.mock('../../../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: {
        debug: (...args: any[]) => loggerDebugMock(...args),
        warn: (...args: any[]) => loggerWarnMock(...args),
    },
}));

describe('OpenAsUrlDragAction', () => {
    beforeAll(() => {
        // @ts-ignore
        global.window.open = openMock;
        // @ts-ignore
        delete global.window.location;
        // @ts-ignore
        global.window.location = { href: '', assign: locationAssignMock };
    });
    beforeEach(() => {
        openMock.mockClear();
        locationAssignMock.mockClear();
        loggerDebugMock.mockClear();
        loggerWarnMock.mockClear();
        // @ts-ignore
        global.window.location.href = '';
    });

    it('newTab=trueでwindow.openが呼ばれること', async () => {
        const action = new OpenAsUrlDragAction();
        await action.execute({
            type: 'text',
            direction: 'down',
            actionName: 'openAsUrl',
            params: { text: 'example.com', newTab: true },
        });
        expect(openMock).toHaveBeenCalledWith('http://example.com', '_blank');
    });

    it('newTab=falseでwindow.location.hrefが書き換えられること', async () => {
        const action = new OpenAsUrlDragAction();
        await action.execute({
            type: 'text',
            direction: 'down',
            actionName: 'openAsUrl',
            params: { text: 'example.com', newTab: false },
        });
        expect(global.window.location.href).toBe('http://example.com');
    });

    it('text未指定時はwindow.open/location.hrefされず警告ログが出ること', async () => {
        const action = new OpenAsUrlDragAction();
        await action.execute({
            type: 'text',
            direction: 'down',
            actionName: 'openAsUrl',
            params: {},
        });
        expect(openMock).not.toHaveBeenCalled();
        expect(global.window.location.href).not.toBe('http://example.com');
        expect(loggerWarnMock).toHaveBeenCalled();
    });
}); 