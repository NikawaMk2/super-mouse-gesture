import { logger } from "../../../shared/logger";
import { GestureDirection } from "../../../shared/types/gesture-direction";

/**
 * 座標を表すクラス
 */
export class Point {
    /** 無効な座標を表す定数 */
    static readonly NONE = new Point(NaN, NaN);

    /** 方向判定の閾値（ピクセル） */
    private readonly THRESHOLD = 30;

    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * この座標から指定した座標への方向を取得する
     * @param to 目標座標
     * @returns 方向（閾値未満の場合はundefined）
     */
    public getDirection(to: Point): GestureDirection | undefined {
        if (this.isNone()) {
            logger.warn('Point', 'Point.NONEに対してgetDirectionが呼び出されました');
            return undefined;
        }
        if (to.isNone()) {
            logger.warn('Point', 'Point.NONEがgetDirectionの引数に指定されました');
            return undefined;
        }

        const dx = to.x - this.x;
        const dy = to.y - this.y;

        if (Math.abs(dx) >= Math.abs(dy)) {
            if (dx > this.THRESHOLD) return GestureDirection.RIGHT;
            if (dx < -this.THRESHOLD) return GestureDirection.LEFT;
        } else {
            if (dy > this.THRESHOLD) return GestureDirection.DOWN;
            if (dy < -this.THRESHOLD) return GestureDirection.UP;
        }
        return undefined;
    }

    /**
     * この座標が無効（NONE）かどうかを判定する
     * @returns 無効な場合はtrue
     */
    public isNone(): boolean {
        return isNaN(this.x) || isNaN(this.y);
    }

    /**
     * Canvas描画のmoveToを実行する
     * @param context Canvasの2Dコンテキスト
     */
    public canvasMoveTo(context: CanvasRenderingContext2D): void {
        context.moveTo(this.x, this.y);
    }

    /**
     * Canvas描画のlineToを実行する
     * @param context Canvasの2Dコンテキスト
     */
    public canvasLineTo(context: CanvasRenderingContext2D): void {
        context.lineTo(this.x, this.y);
    }

    /**
     * この座標から指定した座標までの距離を計算する
     * @param to 目標座標
     * @returns 2点間の距離
     */
    public calculateDistance(to: Point): number {
        return Math.sqrt(
            Math.pow(to.x - this.x, 2) +
            Math.pow(to.y - this.y, 2)
        );
    }
}
