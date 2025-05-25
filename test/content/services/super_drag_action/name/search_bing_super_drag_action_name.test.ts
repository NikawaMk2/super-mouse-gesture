import { SearchBingSuperDragActionName } from '../../../../../src/content/services/super_drag_action/name/search_bing_super_drag_action_name';

describe('SearchBingSuperDragActionName', () => {
    describe('getJapaneseName', () => {
        it('正しい日本語名を返すこと', () => {
            const actionName = new SearchBingSuperDragActionName();
            expect(actionName.getJapaneseName()).toBe('Bingで検索');
        });
    });
}); 