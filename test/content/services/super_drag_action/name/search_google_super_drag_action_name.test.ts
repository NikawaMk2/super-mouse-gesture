import { SearchGoogleSuperDragActionName } from '../../../../../src/content/services/super_drag_action/name/search_google_super_drag_action_name';

describe('SearchGoogleSuperDragActionName', () => {
    describe('getJapaneseName', () => {
        it('正しい日本語名を返すこと', () => {
            const actionName = new SearchGoogleSuperDragActionName();
            expect(actionName.getJapaneseName()).toBe('Googleで検索');
        });
    });
}); 