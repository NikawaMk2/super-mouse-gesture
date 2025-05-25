import { OpenInBackgroundTabSuperDragActionName } from '../../../../../src/content/services/super_drag_action/name/open_in_background_tab_super_drag_action_name';

describe('OpenInBackgroundTabSuperDragActionName', () => {
    describe('getJapaneseName', () => {
        it('正しい日本語名を返すこと', () => {
            const actionName = new OpenInBackgroundTabSuperDragActionName();
            expect(actionName.getJapaneseName()).toBe('バックグラウンドタブで開く');
        });
    });
}); 