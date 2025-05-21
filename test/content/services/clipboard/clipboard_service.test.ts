import { ClipboardService } from '../../../../src/content/services/clipboard/clipboard_service';

describe('ClipboardService', () => {
    let clipboardService: ClipboardService;
    let originalClipboard: typeof navigator.clipboard;
    let writeTextMock: jest.Mock;

    beforeAll(() => {
        // navigator.clipboardのモック化
        originalClipboard = Object.getOwnPropertyDescriptor(window.navigator, 'clipboard')?.value;
        writeTextMock = jest.fn();
        Object.defineProperty(window.navigator, 'clipboard', {
            value: { writeText: writeTextMock },
            configurable: true,
        });
    });

    afterAll(() => {
        // 元に戻す
        Object.defineProperty(window.navigator, 'clipboard', {
            value: originalClipboard,
            configurable: true,
        });
    });

    beforeEach(() => {
        clipboardService = new ClipboardService();
        writeTextMock.mockClear();
    });

    it('writeTextでnavigator.clipboard.writeTextが呼ばれる', async () => {
        await clipboardService.writeText('test-text');
        expect(writeTextMock).toHaveBeenCalledWith('test-text');
    });

    it('writeTextで例外が発生しないこと', async () => {
        writeTextMock.mockImplementation(() => Promise.resolve());
        await expect(clipboardService.writeText('abc')).resolves.toBeUndefined();
    });

    it('writeTextでclipboard APIが未定義の場合はエラーになる', async () => {
        Object.defineProperty(window.navigator, 'clipboard', {
            value: undefined,
            configurable: true,
        });
        clipboardService = new ClipboardService();
        await expect(clipboardService.writeText('abc')).rejects.toThrow();
    });
}); 