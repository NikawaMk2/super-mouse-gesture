import { Point } from '../models/point';
import { logger } from '@/shared/logger';
import { settings } from '@/shared/utils/settings';
import { hideActionName } from './visual-action-name';

/**
 * Canvas要素とそのコンテキスト
 */
let canvas: HTMLCanvasElement | null = null;
let context: CanvasRenderingContext2D | null = null;

/**
 * トレイル描画用のポイントリスト
 */
let trailPoints: Array<Point> = [];

/**
 * リサイズイベントのハンドラー
 */
let resizeHandler: (() => void) | null = null;

/**
 * 設定変更リスナーの削除関数
 */
let settingsChangeUnsubscribe: (() => void) | null = null;

/**
 * Canvasを全画面サイズにリサイズする
 */
function resizeCanvas(): void {
  if (!canvas) {
    return;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;

  if (context) {
    const currentSettings = settings.getSettings();
    context.lineWidth = currentSettings.trailWidth;
    context.strokeStyle = currentSettings.trailColor;
    context.lineJoin = 'round';
    context.lineCap = 'round';
  }
}

/**
 * ジェスチャトレイルを描画する
 */
function drawTrail(): void {
  if (!context || trailPoints.length < 2) {
    return;
  }

  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  context.beginPath();
  trailPoints[0]!.canvasMoveTo(context);

  for (let i = 1; i < trailPoints.length; i++) {
    trailPoints[i]!.canvasLineTo(context);
  }

  context.stroke();
}

/**
 * ジェスチャトレイルの描画を開始する
 * 
 * Canvas要素を作成し、全画面にオーバーレイとして配置する。
 * ウィンドウリサイズイベントを監視し、Canvasサイズを自動調整する。
 * 既にトレイル描画が開始されている場合は警告を出力して処理を中断する。
 */
export function startTrail(): void {
  if (canvas) {
    logger.warn('visual-trail', 'トレイル描画は既に開始されています');
    return;
  }

  canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '2147483647';

  context = canvas.getContext('2d');
  if (!context) {
    logger.error('visual-trail', 'Canvas 2Dコンテキストの取得に失敗しました');
    canvas = null;
    return;
  }

  resizeCanvas();

  resizeHandler = () => {
    resizeCanvas();
    drawTrail();
  };
  window.addEventListener('resize', resizeHandler);

  // 設定変更を監視してトレイルを更新
  settingsChangeUnsubscribe = settings.onSettingsChange(() => {
    resizeCanvas();
    drawTrail();
  });

  document.body.appendChild(canvas);
  trailPoints = [];

  logger.debug('visual-trail', 'トレイル描画を開始しました');
}

/**
 * トレイルにポイントを追加する
 * @param point 追加するポイント
 */
export function addTrailPoint(point: Point): void {
  if (!canvas || !context) {
    logger.warn('visual-trail', 'トレイル描画が開始されていません');
    return;
  }

  if (point.isNone()) {
    return;
  }

  trailPoints.push(point);
  drawTrail();
}

/**
 * ジェスチャトレイルの描画を終了し、すべての描画要素を削除する
 */
export function endTrail(): void {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }

  if (settingsChangeUnsubscribe) {
    settingsChangeUnsubscribe();
    settingsChangeUnsubscribe = null;
  }

  if (canvas && canvas.parentNode) {
    canvas.parentNode.removeChild(canvas);
    canvas = null;
    context = null;
  }

  trailPoints = [];
  hideActionName();

  logger.debug('visual-trail', 'トレイル描画を終了しました');
}

