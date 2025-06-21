import { OpenInForegroundTabSuperDragActionName } from '../../../../../src/content/services/super_drag_action/name/open_in_foreground_tab_super_drag_action_name';

describe('OpenInForegroundTabSuperDragActionName', () => {
    describe('getJapaneseName', () => {
        it('正しい日本語名を返すこと', () => {
            const actionName = new OpenInForegroundTabSuperDragActionName();
            expect(actionName.getJapaneseName()).toBe('フォアグラウンドタブで開く');
        });
    });
}); 