/**
 * @jest-environment jsdom
 */
import { ActionNotification } from '../../../src/content/handlers/action_notification';
import Logger from '../../../src/common/logger/logger';

describe('ActionNotification', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        ActionNotification.destroy();
    });

    afterEach(() => {
        ActionNotification.destroy();
    });

    it('showで通知が中央に表示される', () => {
        const spyInfo = jest.spyOn(Logger, 'info');
        ActionNotification.show('TestAction');
        const elem = document.getElementById('smg-action-notification');
        expect(elem).not.toBeNull();
        expect(elem?.textContent).toBe('TestAction');
        expect(elem?.style.display).toBe('flex');
        expect(spyInfo).toHaveBeenCalledWith('アクション通知UIを表示', { actionName: 'TestAction' });
    });

    it('showで既存通知があれば内容だけ更新', () => {
        ActionNotification.show('First');
        const spyDebug = jest.spyOn(Logger, 'debug');
        ActionNotification.show('Second');
        const elem = document.getElementById('smg-action-notification');
        expect(elem?.textContent).toBe('Second');
        expect(elem?.style.display).toBe('flex');
        expect(spyDebug).toHaveBeenCalledWith('アクション通知UIを更新', { actionName: 'Second' });
    });

    it('hideで通知が非表示になる', () => {
        ActionNotification.show('TestAction');
        const spyInfo = jest.spyOn(Logger, 'info');
        ActionNotification.hide();
        const elem = document.getElementById('smg-action-notification');
        expect(elem?.style.display).toBe('none');
        expect(spyInfo).toHaveBeenCalledWith('アクション通知UIを非表示');
    });

    it('destroyで通知がDOMから削除される', () => {
        ActionNotification.show('TestAction');
        const spyInfo = jest.spyOn(Logger, 'info');
        ActionNotification.destroy();
        const elem = document.getElementById('smg-action-notification');
        expect(elem).toBeNull();
        expect(spyInfo).toHaveBeenCalledWith('アクション通知UIをDOMから削除');
    });

    it('showで例外発生時にLogger.errorが呼ばれる', () => {
        const spyError = jest.spyOn(Logger, 'error');
        // appendChildで例外を投げる
        jest.spyOn(document.body, 'appendChild').mockImplementationOnce(() => { throw new Error('fail'); });
        ActionNotification.show('TestAction');
        expect(spyError).toHaveBeenCalledWith('アクション通知UIの表示に失敗', { error: 'fail' });
    });
}); 