/**
 * バックグラウンド側のメッセージハンドラー
 * 
 * Content Scriptから送信されるメッセージを受信し、
 * 適切なアクションを実行する。
 */

import { logger } from "@/shared/logger";
import { ExtensionMessage, ExtensionMessageType } from "@/shared/types/extension-message";
import { settings } from "@/shared/utils/settings";
import { createActionFromMessage } from "./gestures/actions/gesture_action_factory";
import { createDragActionFromMessage } from "./drag/actions/drag_action_factory";

/**
 * 拡張機能メッセージのレスポンス型
 */
interface ExtensionResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * メッセージハンドラーを設定する
 * 
 * `chrome.runtime.onMessage`リスナーを登録し、
 * Content Scriptから送信されるメッセージを処理する。
 */
export function setupMessageHandlers(): void {
  chrome.runtime.onMessage.addListener(
    (
      message: ExtensionMessage,
      _sender: chrome.runtime.MessageSender,
      sendResponse: (response: ExtensionResponse) => void
    ): boolean => {
      // 非同期処理のため、trueを返してレスポンスを非同期で送信できるようにする
      handleMessage(message)
        .then((response) => {
          sendResponse(response);
        })
        .catch((error) => {
          logger.error('handlers', 'メッセージ処理中にエラーが発生しました', error);
          sendResponse({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        });

      return true; // 非同期レスポンスを許可
    }
  );

  logger.info('handlers', 'メッセージハンドラーを設定しました');
}

/**
 * メッセージを処理する
 * 
 * @param message 拡張機能メッセージ
 * @returns レスポンス
 */
async function handleMessage(message: ExtensionMessage): Promise<ExtensionResponse> {
  logger.debug('handlers', 'メッセージを受信しました', { type: message.type, payload: message.payload });

  try {
    // GET_SETTINGSの場合は設定を返す
    if (message.type === ExtensionMessageType.GET_SETTINGS) {
      const settingsData = {
        settings: settings.getSettings(),
        gestures: settings.getGestures(),
      };
      return {
        success: true,
        data: settingsData,
      };
    }

    // ジェスチャアクションを試行
    const gestureAction = createActionFromMessage(message);
    if (gestureAction) {
      await gestureAction.execute(message.payload);
      return {
        success: true,
      };
    }

    // ドラッグアクションを試行
    const dragAction = createDragActionFromMessage(message);
    if (dragAction) {
      await dragAction.execute(message.payload);
      return {
        success: true,
      };
    }

    // 対応するアクションが見つからない場合
    logger.warn('handlers', '未対応のメッセージタイプです', { type: message.type });
    return {
      success: false,
      error: `Unsupported message type: ${message.type}`,
    };
  } catch (error) {
    logger.error('handlers', 'アクション実行中にエラーが発生しました', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

