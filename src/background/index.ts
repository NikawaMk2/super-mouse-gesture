import { BackgroundContainerProvider } from './provider/background_container_provider';
import { MessageListener, IGestureActionHandler, IDragActionHandler } from './services/message_listener';
import Logger from '../common/logger/logger';

// 開発環境かどうかを確認
Logger.info('バックグラウンドスクリプト開始');

// 初期化処理を非同期関数でラップ
async function initialize() {
    try {
        Logger.info('バックグラウンド初期設定開始');

        const containerProvider = new BackgroundContainerProvider();
        const container = containerProvider.getContainer();

        const gestureActionHandler = container.get<IGestureActionHandler>('IGestureActionHandler');
        const dragActionHandler = container.get<IDragActionHandler>('IDragActionHandler');
        const messageListener = new MessageListener(gestureActionHandler, dragActionHandler);

        messageListener.listen();

        Logger.info('バックグラウンド初期設定完了');
    } catch (error) {
        Logger.error('バックグラウンド初期化エラー', { error });
    }
}

// Service Workerのライフサイクルイベントをリッスン
chrome.runtime.onInstalled.addListener(() => {
    Logger.info('拡張機能がインストール/アップデートされました');
    initialize();
});

// Service Workerがアクティブになったときのイベント
self.addEventListener('activate', (event) => {
    Logger.info('Service Workerがアクティブになりました');
    initialize();
});

// 初期化処理を実行
initialize();
