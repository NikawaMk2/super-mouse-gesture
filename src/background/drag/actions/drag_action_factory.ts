import { ExtensionMessage, ExtensionMessageType } from "@/shared/types/extension-message";
import { BackgroundAction } from "../../gestures/actions/events/background_action";
import { openLinkAction } from "./events/open_link_action";
import { searchTextAction } from "./events/search_text_action";
import { noopAction } from "./events/noop_action";

/**
 * サービスワーカー側でメッセージのtypeからドラッグアクションオブジェクトを作成する
 * @param message 拡張機能メッセージ
 * @returns バックグラウンドアクション（ドラッグアクション）
 */
export function createDragActionFromMessage(message: ExtensionMessage): BackgroundAction | null {
  switch (message.type) {
    case ExtensionMessageType.DRAG_OPEN_LINK:
      return openLinkAction;
    case ExtensionMessageType.DRAG_SEARCH_TEXT:
      return searchTextAction;
    default:
      return noopAction;
  }
}

