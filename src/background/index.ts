import Logger from "../common/utils/logger";
import ChromeMessageListener from "./listener/chrome_message_listener";

chrome.runtime.onInstalled.addListener(() => {
    Logger.debug('拡張機能インストール');
});

const chromeMessageListener = new ChromeMessageListener();

// 拡張機能のアンロード時にリスナーを破棄
chrome.runtime.onSuspend.addListener(() => {
    chromeMessageListener.dispose();
    Logger.debug('拡張機能アンロード');
});
