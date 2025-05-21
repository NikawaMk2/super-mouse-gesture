import { ChromeWindowOperator } from '../../../../src/background/services/gesture_action/chrome_window_operator';

describe('ChromeWindowOperator', () => {
    let operator: ChromeWindowOperator;
    let chromeMock: any;
    let originalLastError: any;

    beforeEach(() => {
        operator = new ChromeWindowOperator();
        originalLastError = global.chrome?.runtime?.lastError;
        global.chrome = {
            runtime: {},
            windows: {
                getCurrent: jest.fn((cb) => cb({ id: 1, state: 'normal' })),
                update: jest.fn((id, opts, cb) => cb()),
                create: jest.fn((opts, cb) => cb()),
                remove: jest.fn((id, cb) => cb()),
            },
        } as any;
        chromeMock = global.chrome;
    });

    afterEach(() => {
        jest.resetAllMocks();
        if (global.chrome?.runtime) {
            if (originalLastError !== undefined) {
                global.chrome.runtime.lastError = originalLastError;
            } else {
                delete global.chrome.runtime.lastError;
            }
        }
    });

    it('maximizeCurrentWindow: chrome.windows.updateが呼ばれる', async () => {
        await operator.maximizeCurrentWindow();
        expect(chromeMock.windows.getCurrent).toHaveBeenCalled();
        expect(chromeMock.windows.update).toHaveBeenCalledWith(1, { state: 'maximized' }, expect.any(Function));
    });

    it('minimizeCurrentWindow: chrome.windows.updateが呼ばれる', async () => {
        await operator.minimizeCurrentWindow();
        expect(chromeMock.windows.getCurrent).toHaveBeenCalled();
        expect(chromeMock.windows.update).toHaveBeenCalledWith(1, { state: 'minimized' }, expect.any(Function));
    });

    it('toggleFullscreenCurrentWindow: chrome.windows.updateが呼ばれる', async () => {
        chromeMock.windows.getCurrent = jest.fn((cb) => cb({ id: 1, state: 'normal' }));
        await operator.toggleFullscreenCurrentWindow();
        expect(chromeMock.windows.update).toHaveBeenCalledWith(1, { state: 'fullscreen' }, expect.any(Function));
    });

    it('toggleFullscreenCurrentWindow: 既にfullscreenならnormalに戻す', async () => {
        chromeMock.windows.getCurrent = jest.fn((cb) => cb({ id: 1, state: 'fullscreen' }));
        await operator.toggleFullscreenCurrentWindow();
        expect(chromeMock.windows.update).toHaveBeenCalledWith(1, { state: 'normal' }, expect.any(Function));
    });

    it('createNewWindow: chrome.windows.createが呼ばれる', async () => {
        await operator.createNewWindow();
        expect(chromeMock.windows.create).toHaveBeenCalledWith({}, expect.any(Function));
    });

    it('createNewIncognitoWindow: chrome.windows.createがincognito:trueで呼ばれる', async () => {
        await operator.createNewIncognitoWindow();
        expect(chromeMock.windows.create).toHaveBeenCalledWith({ incognito: true }, expect.any(Function));
    });

    it('closeCurrentWindow: chrome.windows.removeが呼ばれる', async () => {
        await operator.closeCurrentWindow();
        expect(chromeMock.windows.getCurrent).toHaveBeenCalled();
        expect(chromeMock.windows.remove).toHaveBeenCalledWith(1, expect.any(Function));
    });

    it('chrome.windowsが未定義ならエラーにならずreturn', async () => {
        global.chrome = {} as any;
        await expect(operator.maximizeCurrentWindow()).resolves.toBeUndefined();
    });

    it('chrome.windows.getCurrentが例外を投げた場合catchされる', async () => {
        chromeMock.windows.getCurrent = jest.fn((cb) => {
            global.chrome.runtime.lastError = { message: 'fail' };
            cb(undefined);
            delete global.chrome.runtime.lastError;
        });
        await expect(operator.maximizeCurrentWindow()).rejects.toThrow('fail');
    });
}); 