import { CopyLinkUrlSuperDragActionName } from '../../../../../src/content/services/super_drag_action/name/copy_link_url_super_drag_action_name';

describe('CopyLinkUrlSuperDragActionName', () => {
    describe('getJapaneseName', () => {
        it('正しい日本語名を返すこと', () => {
            const actionName = new CopyLinkUrlSuperDragActionName();
            expect(actionName.getJapaneseName()).toBe('リンクURLをコピー');
        });
    });
}); 