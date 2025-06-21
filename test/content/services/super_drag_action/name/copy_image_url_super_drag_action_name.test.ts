import { CopyImageUrlSuperDragActionName } from '../../../../../src/content/services/super_drag_action/name/copy_image_url_super_drag_action_name';

describe('CopyImageUrlSuperDragActionName', () => {
    describe('getJapaneseName', () => {
        it('正しい日本語名を返すこと', () => {
            const actionName = new CopyImageUrlSuperDragActionName();
            expect(actionName.getJapaneseName()).toBe('画像URLをコピー');
        });
    });
}); 