import Logger from '../../common/logger/logger';

export class ActionNotification {
    private static notificationId = 'smg-action-notification';
    private static notificationElem: HTMLDivElement | null = null;

    /**
     * アクション名を中央に表示する
     * @param actionName 表示するアクション名
     */
    public static show(actionName: string): void {
        try {
            if (this.notificationElem) {
                this.notificationElem.textContent = actionName;
                this.notificationElem.style.display = 'flex';
                Logger.debug('アクション通知UIを更新', { actionName });
                return;
            }
            const div = document.createElement('div');
            div.id = this.notificationId;
            div.textContent = actionName;
            div.style.position = 'fixed';
            div.style.top = '50%';
            div.style.left = '50%';
            div.style.transform = 'translate(-50%, -50%)';
            div.style.background = 'rgba(32,32,32,0.92)';
            div.style.color = '#fff';
            div.style.padding = '16px 32px';
            div.style.borderRadius = '8px';
            div.style.fontSize = '1.3rem';
            div.style.fontWeight = 'bold';
            div.style.zIndex = '999999';
            div.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            div.style.pointerEvents = 'none';
            document.body.appendChild(div);
            this.notificationElem = div;
            Logger.info('アクション通知UIを表示', { actionName });
        } catch (e) {
            Logger.error('アクション通知UIの表示に失敗', { error: (e as Error).message });
        }
    }

    /**
     * 通知を非表示にする
     */
    public static hide(): void {
        try {
            if (this.notificationElem) {
                this.notificationElem.style.display = 'none';
                Logger.info('アクション通知UIを非表示');
            }
        } catch (e) {
            Logger.error('アクション通知UIの非表示に失敗', { error: (e as Error).message });
        }
    }

    /**
     * 完全にDOMから削除したい場合
     */
    public static destroy(): void {
        try {
            if (this.notificationElem && this.notificationElem.parentNode) {
                this.notificationElem.parentNode.removeChild(this.notificationElem);
                Logger.info('アクション通知UIをDOMから削除');
            }
            this.notificationElem = null;
        } catch (e) {
            Logger.error('アクション通知UIのDOM削除に失敗', { error: (e as Error).message });
        }
    }
} 