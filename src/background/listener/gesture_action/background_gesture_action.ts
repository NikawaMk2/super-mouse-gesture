export interface BackgroundGestureAction {
    doAction(sender: chrome.runtime.MessageSender): Promise<void>;
}