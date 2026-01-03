import { GestureActionType } from '@/shared/types/gesture-action';
import { logger } from '@/shared/logger';

/**
 * アクション名表示の設定
 */
const ACTION_NAME_BG_COLOR = 'rgba(0, 0, 0, 0.7)';
const ACTION_NAME_TEXT_COLOR = '#FFFFFF';
const ACTION_NAME_FONT_SIZE = '24px';
const ACTION_NAME_PADDING = '10px 20px';
const ACTION_NAME_BORDER_RADIUS = '4px';

/**
 * アクションタイプから日本語名へのマッピング
 */
const ACTION_NAME_MAP: Record<GestureActionType, string> = {
  [GestureActionType.SCROLL_UP]: '上へスクロール',
  [GestureActionType.SCROLL_DOWN]: '下へスクロール',
  [GestureActionType.GO_BACK]: '戻る',
  [GestureActionType.GO_FORWARD]: '進む',
  [GestureActionType.PREVIOUS_TAB]: '前のタブへ',
  [GestureActionType.NEXT_TAB]: '次のタブへ',
  [GestureActionType.CLOSE_TAB_AND_GO_LEFT]: 'タブを閉じて左へ',
  [GestureActionType.CLOSE_TAB_AND_GO_RIGHT]: 'タブを閉じて右へ',
  [GestureActionType.ZOOM_IN]: 'ページ拡大',
  [GestureActionType.ZOOM_OUT]: 'ページ縮小',
  [GestureActionType.NEW_TAB]: '新規タブ',
  [GestureActionType.TOGGLE_FULLSCREEN]: 'フルスクリーン',
  [GestureActionType.SCROLL_TO_TOP]: 'ページトップへ',
  [GestureActionType.SCROLL_TO_BOTTOM]: 'ページボトムへ',
  [GestureActionType.RELOAD]: '再読み込み',
  [GestureActionType.RESTORE_TAB]: 'タブ復元',
  [GestureActionType.NONE]: '無し',
};

/**
 * アクション名表示用の要素
 */
let actionNameElement: HTMLDivElement | null = null;

/**
 * アクションタイプから日本語名を取得する
 * @param actionType アクションタイプ
 * @returns 日本語名。NONEの場合は空文字列
 */
function getActionName(actionType: GestureActionType): string {
  const name = ACTION_NAME_MAP[actionType];
  return name ?? '';
}

/**
 * アクション名を表示する
 * @param actionType アクションタイプ
 */
export function showActionName(actionType: GestureActionType): void {
  const actionName = getActionName(actionType);
  if (!actionName) {
    hideActionName();
    return;
  }

  if (!actionNameElement) {
    actionNameElement = document.createElement('div');
    actionNameElement.style.position = 'fixed';
    actionNameElement.style.top = '50%';
    actionNameElement.style.left = '50%';
    actionNameElement.style.transform = 'translate(-50%, -50%)';
    actionNameElement.style.backgroundColor = ACTION_NAME_BG_COLOR;
    actionNameElement.style.color = ACTION_NAME_TEXT_COLOR;
    actionNameElement.style.fontSize = ACTION_NAME_FONT_SIZE;
    actionNameElement.style.padding = ACTION_NAME_PADDING;
    actionNameElement.style.borderRadius = ACTION_NAME_BORDER_RADIUS;
    actionNameElement.style.pointerEvents = 'none';
    actionNameElement.style.zIndex = '2147483647';
    actionNameElement.style.whiteSpace = 'nowrap';

    document.body.appendChild(actionNameElement);
  }

  actionNameElement.textContent = actionName;
  actionNameElement.style.display = 'block';

  logger.debug('visual-action-name', `アクション名を表示しました: ${actionName}`);
}

/**
 * アクション名を非表示にする
 */
export function hideActionName(): void {
  if (actionNameElement) {
    actionNameElement.style.display = 'none';
    logger.debug('visual-action-name', 'アクション名を非表示にしました');
  }
}

/**
 * アクション名表示用の要素を削除する（クリーンアップ）
 */
export function cleanupActionName(): void {
  if (actionNameElement && actionNameElement.parentNode) {
    actionNameElement.parentNode.removeChild(actionNameElement);
    actionNameElement = null;
  }
}

