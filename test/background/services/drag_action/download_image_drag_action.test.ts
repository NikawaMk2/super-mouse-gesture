import { DownloadImageDragAction } from '../../../../src/background/services/drag_action/download_image_drag_action';
import { DragActionMessagePayload } from '../../../../src/content/services/message/message_types';
import { IDownloadService } from '../../../../src/background/services/download_service_interface';

describe('DownloadImageDragAction', () => {
    let mockDownloadService: IDownloadService;
    let action: DownloadImageDragAction;

    beforeEach(() => {
        mockDownloadService = {
            download: jest.fn().mockResolvedValue(undefined),
        };
        action = new DownloadImageDragAction(mockDownloadService);
    });

    it('画像URLをダウンロードする', async () => {
        const payload: DragActionMessagePayload = {
            type: 'image',
            direction: 'down',
            actionName: 'downloadImage',
            params: {},
            selectedValue: 'https://example.com/image.png',
        };
        await action.execute(payload);
        expect(mockDownloadService.download).toHaveBeenCalledWith('https://example.com/image.png');
    });

    it('画像URLが未指定の場合はダウンロードしない', async () => {
        const payload: DragActionMessagePayload = {
            type: 'image',
            direction: 'down',
            actionName: 'downloadImage',
            params: {},
            selectedValue: '',
        };
        await action.execute(payload);
        expect(mockDownloadService.download).not.toHaveBeenCalled();
    });

    it('ダウンロード時に例外が発生した場合もエラーで落ちない', async () => {
        (mockDownloadService.download as jest.Mock).mockRejectedValue(new Error('download error'));
        const payload: DragActionMessagePayload = {
            type: 'image',
            direction: 'down',
            actionName: 'downloadImage',
            params: {},
            selectedValue: 'https://example.com/image.png',
        };
        await expect(action.execute(payload)).resolves.not.toThrow();
    });
}); 