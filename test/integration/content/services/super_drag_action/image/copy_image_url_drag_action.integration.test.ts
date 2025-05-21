import { CopyImageUrlDragAction } from '../../../../../../src/content/services/super_drag_action/image/copy_image_url_drag_action';
import { DragType } from '../../../../../../src/content/models/drag_type';
import { Direction } from '../../../../../../src/content/models/direction';
import Logger from '../../../../../../src/common/logger/logger';
import type { IClipboardService } from '../../../../../../src/content/services/clipboard/clipboard_service_interface';

// Loggerをモック
jest.mock('../../../../../../src/common/logger/logger');

// テスト用ClipboardServiceモック
class ClipboardServiceMock implements IClipboardService {
    writeText = jest.fn();
}

describe('CopyImageUrlDragAction (integration)', () => {
    let clipboardServiceMock: ClipboardServiceMock;
    let action: CopyImageUrlDragAction;

    beforeEach(() => {
        clipboardServiceMock = new ClipboardServiceMock();
        action = new CopyImageUrlDragAction(clipboardServiceMock);
        jest.clearAllMocks();
    });

    it('正常系: 画像URLが指定された場合にクリップボードへコピーされること', async () => {
        await action.execute({
            type: DragType.IMAGE,
            direction: Direction.RIGHT,
            actionName: 'copyImageUrl',
            params: {},
            selectedValue: 'https://example.com/image.png',
        });
        expect(clipboardServiceMock.writeText).toHaveBeenCalledWith('https://example.com/image.png');
        expect(Logger.debug).toHaveBeenCalledWith('画像URLをクリップボードにコピーしました', { url: 'https://example.com/image.png' });
    });

    it('異常系: 画像URL未指定時に警告ログが出ること', async () => {
        await action.execute({
            type: DragType.IMAGE,
            direction: Direction.RIGHT,
            actionName: 'copyImageUrl',
            params: {},
            selectedValue: '',
        });
        expect(clipboardServiceMock.writeText).not.toHaveBeenCalled();
        expect(Logger.warn).toHaveBeenCalledWith('コピーする画像URLが指定されていません', expect.any(Object));
    });

    it('異常系: クリップボード書き込み失敗時にエラーログが出ること', async () => {
        (clipboardServiceMock.writeText as jest.Mock).mockRejectedValueOnce(new Error('copy failed'));
        await action.execute({
            type: DragType.IMAGE,
            direction: Direction.RIGHT,
            actionName: 'copyImageUrl',
            params: {},
            selectedValue: 'https://example.com/image.png',
        });
        expect(Logger.error).toHaveBeenCalledWith('画像URLのコピーに失敗しました', expect.objectContaining({ error: expect.any(Error), url: 'https://example.com/image.png' }));
    });
}); 