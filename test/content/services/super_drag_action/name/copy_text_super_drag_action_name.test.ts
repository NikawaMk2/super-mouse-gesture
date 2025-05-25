import { CopyTextSuperDragActionName } from '../../../../../src/content/services/super_drag_action/name/copy_text_super_drag_action_name';

describe('CopyTextSuperDragActionName', () => {
    describe('getJapaneseName', () => {
        it('正しい日本語名を返すこと', () => {
            const actionName = new CopyTextSuperDragActionName();
            expect(actionName.getJapaneseName()).toBe('テキストをコピー');
        });
    });
}); 