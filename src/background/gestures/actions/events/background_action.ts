/**
 * サービスワーカー側で実行するアクションのインターフェース
 */
export interface BackgroundAction {
  execute(payload?: unknown): Promise<void> | void;
}
