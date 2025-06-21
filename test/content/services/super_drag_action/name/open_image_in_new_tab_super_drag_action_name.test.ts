import { OpenImageInNewTabSuperDragActionName } from '../../../../../src/content/services/super_drag_action/name/open_image_in_new_tab_super_drag_action_name';

describe('OpenImageInNewTabSuperDragActionName', () => {
    describe('getJapaneseName', () => {
        it('正しい日本語名を返すこと', () => {
            const actionName = new OpenImageInNewTabSuperDragActionName();
            expect(actionName.getJapaneseName()).toBe('画像を新しいタブで開く');
        });
    });
}); 