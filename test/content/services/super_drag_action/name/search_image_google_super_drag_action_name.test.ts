import { SearchImageGoogleSuperDragActionName } from '../../../../../src/content/services/super_drag_action/name/search_image_google_super_drag_action_name';

describe('SearchImageGoogleSuperDragActionName', () => {
    describe('getJapaneseName', () => {
        it('正しい日本語名を返すこと', () => {
            const actionName = new SearchImageGoogleSuperDragActionName();
            expect(actionName.getJapaneseName()).toBe('Googleで画像検索');
        });
    });
}); 