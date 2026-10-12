import { logger } from '@/shared/logger';
import { getHTMLElementFromEventTarget } from '@/shared/utils/dom-utils';
import { DragDataType, createDragAction } from './actions/drag_action_factory';
import { showActionName, hideActionName } from './visual';
import { DragActionEvent } from './actions/events/drag_action';

/**
 * ドラッグ距離の最小閾値（px）
 * この距離未満のドラッグは誤操作として無視する
 */
const MIN_DRAG_DISTANCE = 10;

/**
 * ドラッグ状態
 */
interface DragState {
  /** ドラッグデータの種類 */
  dataType: DragDataType | null;
  /** ドラッグデータ（URLまたはテキスト） */
  data: string | null;
  /** ドラッグ開始位置 */
  startPosition: { x: number; y: number } | null;
  /** アクション */
  action: DragActionEvent | null;
  /** ドラッグが有効かどうか */
  isActive: boolean;
}

/**
 * ドラッグ状態（モジュールスコープ）
 */
let dragState: DragState = {
  dataType: null,
  data: null,
  startPosition: null,
  action: null,
  isActive: false,
};

/**
 * 要素が編集可能かどうかを判定する
 * @param element 判定対象の要素
 * @returns 編集可能な場合true
 */
function isEditableElement(element: HTMLElement | null): boolean {
  if (!element) {
    return false;
  }

  // tagNameが存在しない場合は編集可能ではない
  if (!element.tagName) {
    return false;
  }

  // input要素、textarea要素、contenteditable属性を持つ要素を編集可能とみなす
  const tagName = element.tagName.toLowerCase();
  if (tagName === 'input' || tagName === 'textarea') {
    return true;
  }

  if (element.contentEditable === 'true') {
    return true;
  }

  // 親要素もチェック
  const parent = element.parentElement;
  if (parent && parent.contentEditable === 'true') {
    return true;
  }

  return false;
}

/**
 * ドラッグされたデータの種類を判定する
 * @param event ドラッグイベント
 * @returns ドラッグデータの種類とデータ
 */
function detectDragData(
  event: DragEvent
): { dataType: DragDataType; data: string } | null {
  const target = getHTMLElementFromEventTarget(event.target);
  if (!target) {
    return null;
  }

  // リンク要素のチェック
  const linkElement = target.closest('a');
  if (linkElement && linkElement.href) {
    const url = linkElement.href.trim();
    if (url && url !== 'javascript:void(0)' && url !== '#') {
      logger.debug('drag-core', 'リンクを検出', { url });
      return { dataType: DragDataType.LINK, data: url };
    }
  }

  // 画像リンクのチェック（imgタグがaタグ内にある場合）
  if (target.tagName && target.tagName.toLowerCase() === 'img') {
    const parentLink = target.closest('a');
    if (parentLink && parentLink.href) {
      const url = parentLink.href.trim();
      if (url && url !== 'javascript:void(0)' && url !== '#') {
        logger.debug('drag-core', '画像リンクを検出', { url });
        return { dataType: DragDataType.LINK, data: url };
      }
    }
  }

  // テキスト選択範囲のチェック
  const selection = window.getSelection();
  if (selection && selection.toString().trim().length > 0) {
    const text = selection.toString().trim();
    logger.debug('drag-core', 'テキストを検出', { text });
    return { dataType: DragDataType.TEXT, data: text };
  }

  // DataTransferからテキストを取得
  const dataTransfer = event.dataTransfer;
  if (dataTransfer) {
    const text = dataTransfer.getData('text/plain');
    if (text && text.trim().length > 0) {
      logger.debug('drag-core', 'DataTransferからテキストを検出', { text });
      return { dataType: DragDataType.TEXT, data: text.trim() };
    }
  }

  return null;
}

/**
 * ドラッグ距離を計算する
 * @param start 開始位置
 * @param end 終了位置
 * @returns 距離（px）
 */
function calculateDistance(
  start: { x: number; y: number },
  end: { x: number; y: number }
): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * ドラッグ開始イベントのハンドラー
 * @param event ドラッグイベント
 */
function handleDragStart(event: DragEvent): void {
  const target = getHTMLElementFromEventTarget(event.target);
  if (!target) {
    return;
  }

  // 編集可能な要素内でのドラッグは無効化
  if (isEditableElement(target)) {
    logger.debug('drag-core', '編集可能な要素内でのドラッグは無効化');
    return;
  }

  // ドラッグデータを検出
  const dragData = detectDragData(event);
  if (!dragData) {
    logger.debug('drag-core', 'ドラッグデータを検出できませんでした');
    return;
  }

  // ドラッグ状態を初期化
  dragState = {
    dataType: dragData.dataType,
    data: dragData.data,
    startPosition: { x: event.clientX, y: event.clientY },
    action: createDragAction(dragData.dataType),
    isActive: true,
  };

  // アクション名を表示
  showActionName(dragData.dataType);

  logger.debug('drag-core', 'ドラッグ開始', {
    dataType: dragData.dataType,
    hasData: !!dragData.data,
  });
}

/**
 * ドラッグ終了イベントのハンドラー
 */
function handleDragEnd(_event: DragEvent): void {
  if (!dragState.isActive) {
    return;
  }

  // アクション名を非表示
  hideActionName();

  // ドラッグ状態をリセット
  dragState = {
    dataType: null,
    data: null,
    startPosition: null,
    action: null,
    isActive: false,
  };

  logger.debug('drag-core', 'ドラッグ終了');
}

/**
 * ドロップイベントのハンドラー
 * @param event ドラッグイベント
 */
function handleDrop(event: DragEvent): void {
  if (!dragState.isActive || !dragState.action || !dragState.data) {
    return;
  }

  // ドラッグ距離をチェック
  if (dragState.startPosition) {
    const distance = calculateDistance(dragState.startPosition, {
      x: event.clientX,
      y: event.clientY,
    });

    if (distance < MIN_DRAG_DISTANCE) {
      logger.debug('drag-core', 'ドラッグ距離が短すぎるためアクションを実行しません', {
        distance,
      });
      handleDragEnd(event);
      return;
    }
  }

  // デフォルトのドロップ処理を無効化
  event.preventDefault();
  event.stopPropagation();

  // アクション名を非表示
  hideActionName();

  // アクションを実行
  logger.debug('drag-core', 'アクションを実行', {
    dataType: dragState.dataType,
    data: dragState.data,
  });

  dragState.action.execute(dragState.data);

  // ドラッグ状態をリセット
  dragState = {
    dataType: null,
    data: null,
    startPosition: null,
    action: null,
    isActive: false,
  };
}

/**
 * ドラッグオーバーイベントのハンドラー
 * @param event ドラッグイベント
 */
function handleDragOver(event: DragEvent): void {
  if (!dragState.isActive) {
    return;
  }

  // ドロップを許可するためにpreventDefaultを呼ぶ
  event.preventDefault();
}

/**
 * スーパードラッグ機能を初期化する
 * 
 * ドラッグイベントのリスナーを設定し、スーパードラッグ機能を有効化する。
 */
export function initialize(): void {
  logger.info('drag-core', 'スーパードラッグ機能を初期化しています...');

  // イベントリスナーを設定
  document.addEventListener('dragstart', handleDragStart);
  document.addEventListener('dragend', handleDragEnd);
  document.addEventListener('drop', handleDrop);
  document.addEventListener('dragover', handleDragOver);

  logger.info('drag-core', 'スーパードラッグ機能の初期化が完了しました');
}
