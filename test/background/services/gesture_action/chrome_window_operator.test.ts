import { ChromeWindowOperator } from '../../../../src/background/services/gesture_action/chrome_window_operator';

describe('ChromeWindowOperator', () => {
    let operator: ChromeWindowOperator;
    let chromeMock: any;

    beforeEach(() => {
        operator = new ChromeWindowOperator();
        chromeMock = global.chrome = {
            windows: {
                getCurrent: jest.fn().mockResolvedValue({ id: 1, state: 'normal' }),
                update: jest.fn().mockResolvedValue(undefined),
                create: jest.fn().mockResolvedValue(undefined),
                remove: jest.fn().mockResolvedValue(undefined),
            },
        } as any;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('maximizeCurrentWindow: chrome.windows.updateが呼ばれる', async () => {
        await operator.maximizeCurrentWindow();
        expect(chromeMock.windows.getCurrent).toHaveBeenCalled();
        expect(chromeMock.windows.update).toHaveBeenCalledWith(1, { state: 'maximized' });
    });

    it('minimizeCurrentWindow: chrome.windows.updateが呼ばれる', async () => {
        await operator.minimizeCurrentWindow();
        expect(chromeMock.windows.getCurrent).toHaveBeenCalled();
        expect(chromeMock.windows.update).toHaveBeenCalledWith(1, { state: 'minimized' });
    });

    it('toggleFullscreenCurrentWindow: chrome.windows.updateが呼ばれる', async () => {
        chromeMock.windows.getCurrent.mockResolvedValueOnce({ id: 1, state: 'normal' });
        await operator.toggleFullscreenCurrentWindow();
        expect(chromeMock.windows.update).toHaveBeenCalledWith(1, { state: 'fullscreen' });
    });

    it('toggleFullscreenCurrentWindow: 既にfullscreenならnormalに戻す', async () => {
        chromeMock.windows.getCurrent.mockResolvedValueOnce({ id: 1, state: 'fullscreen' });
        await operator.toggleFullscreenCurrentWindow();
        expect(chromeMock.windows.update).toHaveBeenCalledWith(1, { state: 'normal' });
    });

    it('createNewWindow: chrome.windows.createが呼ばれる', async () => {
        await operator.createNewWindow();
        expect(chromeMock.windows.create).toHaveBeenCalledWith({});
    });

    it('createNewIncognitoWindow: chrome.windows.createがincognito:trueで呼ばれる', async () => {
        await operator.createNewIncognitoWindow();
        expect(chromeMock.windows.create).toHaveBeenCalledWith({ incognito: true });
    });

    it('closeCurrentWindow: chrome.windows.removeが呼ばれる', async () => {
        await operator.closeCurrentWindow();
        expect(chromeMock.windows.getCurrent).toHaveBeenCalled();
        expect(chromeMock.windows.remove).toHaveBeenCalledWith(1);
    });

    it('chrome.windowsが未定義ならエラーにならずreturn', async () => {
        global.chrome = {} as any;
        await expect(operator.maximizeCurrentWindow()).resolves.toBeUndefined();
    });

    it('chrome.windows.getCurrentが例外を投げた場合catchされる', async () => {
        chromeMock.windows.getCurrent.mockRejectedValueOnce(new Error('fail'));
        await expect(operator.maximizeCurrentWindow()).resolves.toBeUndefined();
    });
}); 