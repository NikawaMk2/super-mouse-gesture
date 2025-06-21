import { OpenAsUrlSuperDragActionName } from '../../../../../src/content/services/super_drag_action/name/open_as_url_super_drag_action_name';

describe('OpenAsUrlSuperDragActionName', () => {
    describe('getJapaneseName', () => {
        it('正しい日本語名を返すこと', () => {
            const actionName = new OpenAsUrlSuperDragActionName();
            expect(actionName.getJapaneseName()).toBe('URLとして開く');
        });
    });
}); 