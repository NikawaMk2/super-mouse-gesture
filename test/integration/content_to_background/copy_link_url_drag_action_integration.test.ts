import { CopyLinkUrlDragAction } from '../../../src/content/services/super_drag_action/link/copy_link_url_drag_action';
import { DragType } from '../../../src/content/models/drag_type';
import { Direction } from '../../../src/content/models/direction';
import Logger from '../../../src/common/logger/logger';

describe('CopyLinkUrlDragAction Integration', () => {
    let originalClipboard: any;
    let action: CopyLinkUrlDragAction;

    beforeEach(() => {
        // clipboardのバックアップ
        originalClipboard = window.navigator.clipboard;
        // clipboardが未定義の場合は空オブジェクトをセット
        if (!window.navigator.clipboard) {
            (window.navigator as any).clipboard = {};
        }
        // writeTextをモック化
        window.navigator.clipboard.writeText = jest.fn();
        jest.clearAllMocks();
        action = new CopyLinkUrlDragAction();
    });

    afterEach(() => {
        // クリップボードを元に戻す
        Object.defineProperty(window.navigator, 'clipboard', {
            value: originalClipboard,
            configurable: true,
        });
    });

    it('content scriptでnavigator.clipboard.writeTextが実行されること', async () => {
        await action.execute({
            type: DragType.LINK,
            direction: Direction.UP,
            actionName: 'copyLinkUrl',
            params: {},
            selectedValue: 'https://example.com/',
        });
        expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/');
    });

    it('リンクURL未指定時にLogger.warnが呼ばれること', async () => {
        const warnSpy = jest.spyOn(Logger, 'warn');
        await action.execute({
            type: DragType.LINK,
            direction: Direction.UP,
            actionName: 'copyLinkUrl',
            params: {},
            selectedValue: '',
        });
        expect(warnSpy).toHaveBeenCalledWith(
            'コピーするリンクURLが指定されていません',
            expect.objectContaining({ options: expect.any(Object) })
        );
        warnSpy.mockRestore();
    });

    it('クリップボード書き込み失敗時にLogger.errorが呼ばれること', async () => {
        const errorSpy = jest.spyOn(Logger, 'error');
        (window.navigator.clipboard.writeText as jest.Mock).mockImplementation(() => {
            throw new Error('clipboard error');
        });
        await action.execute({
            type: DragType.LINK,
            direction: Direction.UP,
            actionName: 'copyLinkUrl',
            params: {},
            selectedValue: 'https://example.com/',
        });
        expect(errorSpy).toHaveBeenCalledWith(
            'リンクURLのコピーに失敗しました',
            expect.objectContaining({ error: expect.any(Error), url: 'https://example.com/' })
        );
        errorSpy.mockRestore();
    });
}); 