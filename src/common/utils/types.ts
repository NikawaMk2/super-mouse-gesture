// DIコンテナのシンボル定義
const TYPES = {
    MessageSender: 'MessageSender',
    ChromeTabOperator: 'ChromeTabOperator'
} as const;

// 型定義をエクスポート
export type Types = typeof TYPES;
// 定数をデフォルトエクスポート
export default TYPES; 