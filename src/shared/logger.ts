/**
 * ロガーユーティリティ
 * 
 * Chrome拡張機能「Super Mouse Gesture」のログ出力を統一管理する。
 * 環境（開発/本番）に応じてログレベルを制御する。
 */

/**
 * ログレベル定義
 */
export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
} as const;

export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

/**
 * ロガー設定
 */
interface LoggerConfig {
  /** 最小ログレベル（このレベル以上のログのみ出力） */
  minLevel: LogLevel;
  /** タイムスタンプを表示するか */
  showTimestamp: boolean;
}

/**
 * ロガー設定（モジュールスコープ）
 */
let config: LoggerConfig = (() => {
  // 開発環境では全レベル、本番環境ではINFO以上のみ出力
  const isDev = typeof __DEV__ !== 'undefined' && __DEV__;
  return {
    minLevel: isDev ? LogLevel.DEBUG : LogLevel.INFO,
    showTimestamp: true,
  };
})();

/**
 * タイムスタンプを生成する
 */
function getTimestamp(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

/**
 * ログを出力する
 */
function log(
  level: LogLevel,
  levelName: string,
  context: string,
  message: string,
  data?: unknown
): void {
  // ログレベルチェック
  if (level < config.minLevel) {
    return;
  }

  // タイムスタンプ生成
  const timestamp = config.showTimestamp ? getTimestamp() : '';

  // ログメッセージ構築
  const parts: string[] = [];
  if (timestamp) {
    parts.push(`[${timestamp}]`);
  }
  parts.push(`[${levelName}]`);
  parts.push(`[${context}]`);
  parts.push(message);

  const logMessage = parts.join(' ');

  // コンソール出力（レベルに応じて適切なメソッドを使用）
  switch (level) {
    case LogLevel.DEBUG:
      console.debug(logMessage, data !== undefined ? data : '');
      break;
    case LogLevel.INFO:
      console.info(logMessage, data !== undefined ? data : '');
      break;
    case LogLevel.WARN:
      console.warn(logMessage, data !== undefined ? data : '');
      break;
    case LogLevel.ERROR:
      console.error(logMessage, data !== undefined ? data : '');
      break;
  }
}

/**
 * ロガーオブジェクト
 */
export const logger = {
  /**
   * DEBUGレベルのログを出力
   * 
   * @param context 実行コンテキストやコンポーネント名
   * @param message ログメッセージ
   * @param data 関連するデータ（任意）
   */
  debug(context: string, message: string, data?: unknown): void {
    log(LogLevel.DEBUG, 'DEBUG', context, message, data);
  },

  /**
   * INFOレベルのログを出力
   * 
   * @param context 実行コンテキストやコンポーネント名
   * @param message ログメッセージ
   * @param data 関連するデータ（任意）
   */
  info(context: string, message: string, data?: unknown): void {
    log(LogLevel.INFO, 'INFO', context, message, data);
  },

  /**
   * WARNレベルのログを出力
   * 
   * @param context 実行コンテキストやコンポーネント名
   * @param message ログメッセージ
   * @param data 関連するデータ（任意）
   */
  warn(context: string, message: string, data?: unknown): void {
    log(LogLevel.WARN, 'WARN', context, message, data);
  },

  /**
   * ERRORレベルのログを出力
   * 
   * @param context 実行コンテキストやコンポーネント名
   * @param message ログメッセージ
   * @param data 関連するデータ（任意）
   */
  error(context: string, message: string, data?: unknown): void {
    log(LogLevel.ERROR, 'ERROR', context, message, data);
  },

  /**
   * 設定を更新する
   * 
   * @param newConfig 新しい設定
   */
  configure(newConfig: Partial<LoggerConfig>): void {
    config = { ...config, ...newConfig };
  },
};
