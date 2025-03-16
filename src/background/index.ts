import '../common/utils/reflect_metadata';
import Logger from "../common/utils/logger";
import ChromeMessageListener from "./listener/chrome_message_listener";
import ContainerProvider from "../common/utils/container_provider";

Logger.debug('バックグラウンドスクリプト初期化開始');

// バックグラウンドコンテナを初期化
try {
    ContainerProvider.getBackgroundContainer();
    Logger.debug('バックグラウンドコンテナ初期化成功');
} catch (error) {
    Logger.error(`バックグラウンドコンテナ初期化失敗: ${error}`);
}

chrome.runtime.onInstalled.addListener(() => {
    Logger.debug('拡張機能インストール');
});

const chromeMessageListener = new ChromeMessageListener();

// 拡張機能のアンロード時にリスナーを破棄
chrome.runtime.onSuspend.addListener(() => {
    chromeMessageListener.dispose();
    Logger.debug('拡張機能アンロード');
});
