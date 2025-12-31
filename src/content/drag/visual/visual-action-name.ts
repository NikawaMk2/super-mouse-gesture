import { DragDataType } from '../actions/drag_action_factory';
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
const ACTION_NAME_MAP: Record<DragDataType, string> = {
  [DragDataType.LINK]: 'リンクを開く',
  [DragDataType.TEXT]: 'テキストを検索',
};

/**
 * アクション名表示用の要素
 */
let actionNameElement: HTMLDivElement | null = null;

/**
 * アクションタイプから日本語名を取得する
 * @param dataType ドラッグデータタイプ
 * @returns 日本語名
 */
function getActionName(dataType: DragDataType): string {
  const name = ACTION_NAME_MAP[dataType];
  return name ?? '';
}

/**
 * アクション名を表示する
 * @param dataType ドラッグデータタイプ
 */
export function showActionName(dataType: DragDataType): void {
  const actionName = getActionName(dataType);
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

