import { ExtensionMessage, ExtensionMessageType } from "@/shared/types/extension-message";
import { BackgroundAction } from "./events/background_action";
import { newTabAction } from "./events/new_tab_action";
import { previousTabAction } from "./events/previous_tab_action";
import { nextTabAction } from "./events/next_tab_action";
import { closeTabAndGoLeftAction } from "./events/close_tab_and_go_left_action";
import { closeTabAndGoRightAction } from "./events/close_tab_and_go_right_action";
import { restoreTabAction } from "./events/restore_tab_action";
import { zoomInAction } from "./events/zoom_in_action";
import { zoomOutAction } from "./events/zoom_out_action";

/**
 * サービスワーカー側でメッセージのtypeからバックグラウンドアクションオブジェクトを作成する
 * @param message 拡張機能メッセージ
 * @returns バックグラウンドアクション（サービスワーカー側で実行可能なもののみ）
 */
export function createActionFromMessage(message: ExtensionMessage): BackgroundAction | null {
  switch (message.type) {
    case ExtensionMessageType.OPEN_NEW_TAB:
      return newTabAction;
    case ExtensionMessageType.TAB_PREV:
      return previousTabAction;
    case ExtensionMessageType.TAB_NEXT:
      return nextTabAction;
    case ExtensionMessageType.CLOSE_TAB_AND_GO_LEFT:
      return closeTabAndGoLeftAction;
    case ExtensionMessageType.CLOSE_TAB_AND_GO_RIGHT:
      return closeTabAndGoRightAction;
    case ExtensionMessageType.RESTORE_TAB:
      return restoreTabAction;
    case ExtensionMessageType.ZOOM_IN:
      return zoomInAction;
    case ExtensionMessageType.ZOOM_OUT:
      return zoomOutAction;
    default:
      return null;
  }
}

