import { DownloadLinkSuperDragActionName } from '../../../../../src/content/services/super_drag_action/name/download_link_super_drag_action_name';

describe('DownloadLinkSuperDragActionName', () => {
    describe('getJapaneseName', () => {
        it('正しい日本語名を返すこと', () => {
            const actionName = new DownloadLinkSuperDragActionName();
            expect(actionName.getJapaneseName()).toBe('リンクをダウンロード');
        });
    });
}); 