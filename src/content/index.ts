/**
 * コンテンツスクリプトのエントリーポイント
 * 
 * 拡張機能がWebページに注入された際に初期化処理を実行する。
 */

import { logger } from '@/shared/logger';
import { settings } from '@/shared/utils/settings';
import { initialize as initializeGestures } from './gestures/core';
import { initialize as initializeDrag } from './drag/core';

/**
 * 拡張機能の初期化処理
 */
async function initialize(): Promise<void> {
  try {
    logger.info('content', 'コンテンツスクリプトを初期化しています...');

    // 設定を初期化
    await settings.initialize();

    // マウスジェスチャ機能を初期化
    initializeGestures();

    // スーパードラッグ機能を初期化
    initializeDrag();

    logger.info('content', 'コンテンツスクリプトの初期化が完了しました');
  } catch (error) {
    logger.error('content', '初期化中にエラーが発生しました', error);
    throw error;
  }
}

// コンテンツスクリプト注入時に初期化を実行
initialize().catch((error) => {
  logger.error('content', '初期化に失敗しました', error);
});

