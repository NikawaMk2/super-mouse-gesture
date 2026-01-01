/**
 * メッセージ送信ユーティリティ
 * 
 * Content ScriptからService Workerへのメッセージ送信を管理する。
 */

import { logger } from '../logger';
import type { ExtensionMessage } from '../types/extension-message';

/**
 * 最大再試行回数
 */
const MAX_RETRIES = 3;
/**
 * 再試行前の待機時間（ミリ秒）
 */
const RETRY_DELAY = 100;

/**
 * Service Workerへのメッセージ送信を再試行機能付きで実行する
 * 
 * - Service Workerが停止している場合、初回のメッセージ送信は失敗する可能性がある
 * - しかし、メッセージ送信自体がService Workerを起動させるため、短い待機後に再試行することで成功する
 * - 最大3回まで再試行し、すべて失敗した場合のみエラーをスローする
 * 
 * @param message 送信する拡張機能メッセージ
 * @param maxRetries 最大再試行回数（デフォルト: 3）
 * @param retryDelay 再試行前の待機時間（ミリ秒、デフォルト: 100ms）
 * @returns Promise<void> 成功した場合は解決、失敗した場合は拒否
 */
export async function sendMessageWithRetry(
  message: ExtensionMessage
): Promise<void> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // メッセージ送信を試行
      // Service Workerが停止している場合、この呼び出しで自動的に起動される
      await chrome.runtime.sendMessage(message);
      
      // 成功した場合はログを出力して終了
      if (attempt > 0) {
        logger.debug('message-sender', 'メッセージ送信に成功しました（再試行後）', {
          type: message.type,
          attempt: attempt + 1,
        });
      }
      return;
    } catch (error) {
      lastError = error;
      
      // 最後の試行でも失敗した場合は、エラーをスロー
      if (isLastAttempt(attempt)) {
        logger.error('message-sender', 'メッセージ送信がすべての再試行で失敗しました', {
          type: message.type,
          MAX_RETRIES,
          error,
        });
        throw error;
      }
      
      // 再試行前のログ出力
      logger.debug('message-sender', 'メッセージ送信が失敗、再試行します', {
        type: message.type,
        attempt: attempt + 1,
        MAX_RETRIES,
      });
      
      // Service Workerの起動時間を確保するため、短い待機時間を設ける
      // この待機により、初回メッセージで起動したService Workerが準備完了する時間を確保
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  
  // このコードには通常到達しないが、TypeScriptの型チェックのために必要
  throw lastError;
}

/**
 * 最後の再試行かどうかを判定する
 * @param attempt 再試行回数
 * @returns 最後の再試行かどうか
 */
function isLastAttempt(attempt: number): boolean {
    return attempt === MAX_RETRIES - 1;
}
