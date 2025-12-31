/**
 * バックグラウンド Service Worker のエントリーポイント
 * 
 * 拡張機能起動時に初期化処理を実行する。
 */

import { logger } from "@/shared/logger";
import { settings } from "@/shared/utils/settings";
import { setupMessageHandlers } from "./handlers";

/**
 * 拡張機能の初期化処理
 */
async function initialize(): Promise<void> {
  try {
    logger.info('background', 'バックグラウンド Service Worker を初期化しています...');

    // 設定を初期化
    await settings.initialize();

    // メッセージハンドラーを設定
    setupMessageHandlers();

    logger.info('background', 'バックグラウンド Service Worker の初期化が完了しました');
  } catch (error) {
    logger.error('background', '初期化中にエラーが発生しました', error);
    throw error;
  }
}

// 拡張機能起動時に初期化を実行
initialize().catch((error) => {
  logger.error('background', '初期化に失敗しました', error);
});

