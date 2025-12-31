import { logger } from '@/shared/logger';
import { Point } from './models/point';
import { DirectionTrail } from './models/direction_trail';
import { createGestureAction } from './actions/gesture_action_factory';
import { GestureActionEvent } from './actions/events/gesture_action';
import { startTrail, addTrailPoint, endTrail } from './visual';
import { showActionName, hideActionName } from './visual';
import { GestureActionType } from '@/shared/types/gesture-action';
import { settings } from '@/shared/utils/settings';

/**
 * ジェスチャ開始時の最小移動距離（px）
 * この距離未満の移動は誤操作として無視する
 */
const MIN_GESTURE_DISTANCE = 10;

/**
 * ジェスチャ状態
 */
interface GestureState {
  /** ジェスチャが開始されたかどうか */
  isActive: boolean;
  /** 開始位置 */
  startPoint: Point;
  /** 前回の座標（方向判定用） */
  lastPoint: Point;
  /** 方向履歴 */
  trail: DirectionTrail;
  /** 現在のアクション */
  action: GestureActionEvent | null;
  /** アクションタイプ */
  actionType: GestureActionType;
}

/**
 * ジェスチャ状態（モジュールスコープ）
 */
let gestureState: GestureState = {
  isActive: false,
  startPoint: Point.NONE,
  lastPoint: Point.NONE,
  trail: new DirectionTrail(),
  action: null,
  actionType: GestureActionType.NONE,
};

/**
 * 次のコンテキストメニューを抑制するかどうか
 */
let preventNextContextMenu = false;

/**
 * 要素が編集可能かどうかを判定する
 * @param element 判定対象の要素
 * @returns 編集可能な場合true
 */
function isEditableElement(element: HTMLElement | null): boolean {
  if (!element) {
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
 * ジェスチャ状態を更新し、アクション名を表示する
 */
function updateActionDisplay(): void {
  gestureState.action = createGestureAction(gestureState.trail);
  gestureState.actionType = settings.getActionForGesture(gestureState.trail.toPath());
  showActionName(gestureState.actionType);
}

/**
 * ジェスチャを開始する
 * @param event マウスイベント
 */
function handleGestureStart(event: MouseEvent): void {
  // 右クリック（button: 2）以外は無視
  if (event.button !== 2) {
    return;
  }

  // コンテキストメニュー抑制フラグを初期化
  preventNextContextMenu = false;

  const target = event.target as HTMLElement;

  // 編集可能な要素内でのジェスチャは無効化
  if (isEditableElement(target)) {
    logger.debug('gesture-core', '編集可能な要素内でのジェスチャは無効化');
    return;
  }

  // 既にジェスチャが開始されている場合は無視
  if (gestureState.isActive) {
    return;
  }

  const startPoint = new Point(event.clientX, event.clientY);

  // ジェスチャ状態を初期化
  gestureState = {
    isActive: true,
    startPoint: startPoint,
    lastPoint: startPoint,
    trail: new DirectionTrail(),
    action: null,
    actionType: GestureActionType.NONE,
  };

  // トレイル描画を開始
  startTrail();
  addTrailPoint(startPoint);

  logger.debug('gesture-core', 'ジェスチャを開始', {
    x: event.clientX,
    y: event.clientY,
  });
}

/**
 * ジェスチャ追跡中（マウス移動）
 * @param event マウスイベント
 */
function handleGestureMove(event: MouseEvent): void {
  if (!gestureState.isActive) {
    return;
  }

  const currentPoint = new Point(event.clientX, event.clientY);

  // 方向を判定
  const direction = gestureState.lastPoint.getDirection(currentPoint);
  if (direction) {
    // 方向が検出された場合、トレイルに追加
    gestureState.trail.add(direction);
    gestureState.lastPoint = currentPoint;
    updateActionDisplay();

    logger.debug('gesture-core', '方向を検出', {
      direction,
      path: gestureState.trail.toPath(),
    });
  }

  // トレイルにポイントを追加（描画用）
  addTrailPoint(currentPoint);
}

/**
 * ジェスチャを終了し、アクションを実行する
 * @param event マウスイベント
 */
function handleGestureEnd(event: MouseEvent): void {
  if (!gestureState.isActive) {
    return;
  }

  // 右クリック（button: 2）以外の場合はキャンセルとして扱う
  if (event.button !== 2) {
    cancelGesture();
    return;
  }

  // 移動距離をチェック
  const distance = gestureState.startPoint.calculateDistance(
    new Point(event.clientX, event.clientY)
  );

  if (distance < MIN_GESTURE_DISTANCE) {
    logger.debug('gesture-core', 'ジェスチャ距離が短すぎるためアクションを実行しません', {
      distance,
    });
    cancelGesture();
    return;
  }

  // ジェスチャが有効な場合、次のコンテキストメニューを抑制
  preventNextContextMenu = true;

  // アクション名を非表示
  hideActionName();

  // アクションを実行
  const actionPath = gestureState.trail.toPath();
  logger.debug('gesture-core', 'アクションを実行', {
    path: actionPath,
    actionType: gestureState.actionType,
  });

  if (gestureState.action) {
    gestureState.action.execute();
  }

  // クリーンアップ
  endTrail();

  // ジェスチャ状態をリセット
  gestureState = {
    isActive: false,
    startPoint: Point.NONE,
    lastPoint: Point.NONE,
    trail: new DirectionTrail(),
    action: null,
    actionType: GestureActionType.NONE,
  };

  logger.debug('gesture-core', 'ジェスチャを終了');
}

/**
 * ジェスチャをキャンセルする
 */
function cancelGesture(): void {
  if (!gestureState.isActive) {
    return;
  }

  logger.debug('gesture-core', 'ジェスチャをキャンセル');

  // アクション名を非表示
  hideActionName();

  // クリーンアップ
  endTrail();

  // ジェスチャ状態をリセット
  gestureState = {
    isActive: false,
    startPoint: Point.NONE,
    lastPoint: Point.NONE,
    trail: new DirectionTrail(),
    action: null,
    actionType: GestureActionType.NONE,
  };
}

/**
 * 左クリックでジェスチャをキャンセル
 * @param event マウスイベント
 */
function handleLeftClick(event: MouseEvent): void {
  if (!gestureState.isActive) {
    return;
  }

  // 左クリック（button: 0）が押された場合、キャンセル
  if (event.button === 0) {
    cancelGesture();
  }
}

/**
 * ESCキーでジェスチャをキャンセル
 * @param event キーボードイベント
 */
function handleKeyDown(event: KeyboardEvent): void {
  if (!gestureState.isActive) {
    return;
  }

  // ESCキーが押された場合、キャンセル
  if (event.key === 'Escape') {
    cancelGesture();
  }
}

/**
 * コンテキストメニューの表示を抑制
 * @param event コンテキストメニューイベント
 */
function handleContextMenu(event: MouseEvent): void {
  // ジェスチャがアクティブな場合、または抑制フラグが立っている場合はコンテキストメニューを抑制
  if (gestureState.isActive || preventNextContextMenu) {
    event.preventDefault();
    event.stopPropagation();
    preventNextContextMenu = false;
  }
}

/**
 * マウスジェスチャ機能を初期化する
 * 
 * マウスイベントのリスナーを設定し、マウスジェスチャ機能を有効化する。
 */
export function initialize(): void {
  logger.info('gesture-core', 'マウスジェスチャ機能を初期化しています...');

  // イベントリスナーを設定
  // mousedownは右クリックを検知（capture: trueで他の要素のイベントより先に処理）
  document.addEventListener('mousedown', handleGestureStart, true);
  document.addEventListener('mousemove', handleGestureMove, true);
  document.addEventListener('mouseup', handleGestureEnd, true);
  document.addEventListener('mouseup', handleLeftClick, true);
  document.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('contextmenu', handleContextMenu, true);

  logger.info('gesture-core', 'マウスジェスチャ機能の初期化が完了しました');
}
