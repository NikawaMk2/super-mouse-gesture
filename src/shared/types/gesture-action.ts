/**
 * ジェスチャアクションの種類
 */
export const GestureActionType = {
  /** 上へスクロール */
  SCROLL_UP: 'scroll-up',
  /** 下へスクロール */
  SCROLL_DOWN: 'scroll-down',
  /** 戻る */
  GO_BACK: 'go-back',
  /** 進む */
  GO_FORWARD: 'go-forward',
  /** 前のタブへ */
  PREVIOUS_TAB: 'previous-tab',
  /** 次のタブへ */
  NEXT_TAB: 'next-tab',
  /** タブを閉じて左へ */
  CLOSE_TAB_AND_GO_LEFT: 'close-tab-and-go-left',
  /** タブを閉じて右へ */
  CLOSE_TAB_AND_GO_RIGHT: 'close-tab-and-go-right',
  /** ページ拡大 */
  ZOOM_IN: 'zoom-in',
  /** ページ縮小 */
  ZOOM_OUT: 'zoom-out',
  /** 新規タブ */
  NEW_TAB: 'new-tab',
  /** フルスクリーン */
  TOGGLE_FULLSCREEN: 'toggle-fullscreen',
  /** ページトップへ */
  SCROLL_TO_TOP: 'scroll-to-top',
  /** ページボトムへ */
  SCROLL_TO_BOTTOM: 'scroll-to-bottom',
  /** 再読み込み */
  RELOAD: 'reload',
  /** タブ復元 */
  RESTORE_TAB: 'restore-tab',
  /** 無し */
  NONE: 'none',
} as const;

export type GestureActionType = typeof GestureActionType[keyof typeof GestureActionType];
