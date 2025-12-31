/**
 * 拡張機能メッセージのアクション種別
 */
export const ExtensionMessageType = {
  /** 新しいタブを開く */
  OPEN_NEW_TAB: 'OPEN_NEW_TAB',
  /** 指定テキストで検索を行う（新しいタブ） */
  SEARCH_TEXT: 'SEARCH_TEXT',
  /** 前のタブを選択 */
  TAB_PREV: 'TAB_PREV',
  /** 次のタブを選択 */
  TAB_NEXT: 'TAB_NEXT',
  /** 現在のタブを閉じ、隣接タブを選択 */
  CLOSE_TAB: 'CLOSE_TAB',
  /** タブを閉じて左へ */
  CLOSE_TAB_AND_GO_LEFT: 'CLOSE_TAB_AND_GO_LEFT',
  /** タブを閉じて右へ */
  CLOSE_TAB_AND_GO_RIGHT: 'CLOSE_TAB_AND_GO_RIGHT',
  /** 閉じたタブを開き直す */
  RESTORE_TAB: 'RESTORE_TAB',
  /** 現在のタブを拡大 */
  ZOOM_IN: 'ZOOM_IN',
  /** 現在のタブを縮小 */
  ZOOM_OUT: 'ZOOM_OUT',
  /** 現在の設定を取得する */
  GET_SETTINGS: 'GET_SETTINGS',
} as const;

export type ExtensionMessageType = typeof ExtensionMessageType[keyof typeof ExtensionMessageType];

/**
 * 拡張機能メッセージのペイロード型
 */
export interface SearchTextPayload {
  text: string;
}

export interface CloseTabPayload {
  selectLeft: boolean;
}

/**
 * 拡張機能メッセージ
 */
export interface ExtensionMessage {
  type: ExtensionMessageType;
  payload?: SearchTextPayload | CloseTabPayload | null;
}

