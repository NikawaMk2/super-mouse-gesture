import { DownloadImageSuperDragActionName } from '../../../../../src/content/services/super_drag_action/name/download_image_super_drag_action_name';

describe('DownloadImageSuperDragActionName', () => {
    describe('getJapaneseName', () => {
        it('正しい日本語名を返すこと', () => {
            const actionName = new DownloadImageSuperDragActionName();
            expect(actionName.getJapaneseName()).toBe('画像をダウンロード');
        });
    });
}); 