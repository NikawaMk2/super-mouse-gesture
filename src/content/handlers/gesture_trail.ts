import { Point } from '../models/point';
import Logger from '../../common/logger/logger';

export interface GestureTrailOptions {
    color?: string;
    width?: number;
    zIndex?: number;
    opacity?: number;
    lineCap?: CanvasLineCap;
    lineJoin?: CanvasLineJoin;
}

export class GestureTrail {
    private canvas: HTMLCanvasElement | null = null;
    private context: CanvasRenderingContext2D | null = null;
    private trailColor: string = 'rgba(255, 0, 0, 0.5)';
    private trailWidth: number = 3;
    private zIndex: number = 999999;
    private lineCap: CanvasLineCap = 'round';
    private lineJoin: CanvasLineJoin = 'round';
    private lastPoint: Point | null = null;
    private animationFrameId: number | null = null;

    constructor(options?: GestureTrailOptions) {
        if (options?.color) this.trailColor = options.color;
        if (options?.width) this.trailWidth = options.width;
        if (options?.zIndex) this.zIndex = options.zIndex;
        if (options?.lineCap) this.lineCap = options.lineCap;
        if (options?.lineJoin) this.lineJoin = options.lineJoin;
    }

    public startDrawing(startPoint: Point): void {
        this.createCanvas();
        if (!this.context || !this.canvas) return;

        this.context.beginPath();
        this.context.moveTo(startPoint.getX() - window.scrollX, startPoint.getY() - window.scrollY);
        this.lastPoint = startPoint;
        Logger.debug('ジェスチャトレイル描画開始', { point: startPoint });
    }

    public updateTrail(point: Point): void {
        if (!this.context || !this.canvas || !this.lastPoint) return;

        // アニメーションフレームを使用して描画を最適化
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        this.animationFrameId = requestAnimationFrame(() => {
            if (!this.context || !this.lastPoint) return;

            const distance = Math.sqrt(
                Math.pow(point.getX() - this.lastPoint.getX(), 2) + 
                Math.pow(point.getY() - this.lastPoint.getY(), 2)
            );

            // 最小距離を設定して描画を最適化
            if (distance < 2) return;

            this.context.lineTo(point.getX() - window.scrollX, point.getY() - window.scrollY);
            this.context.stroke();
            this.lastPoint = point;
            Logger.debug('ジェスチャトレイル描画更新', { point: point });
        });
    }

    public clearTrail(): void {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
            Logger.debug('ジェスチャトレイル描画クリア');
        }
        this.canvas = null;
        this.context = null;
        this.lastPoint = null;
    }

    private createCanvas(): void {
        if (this.canvas) return;

        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = this.zIndex.toString();
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        document.body.appendChild(this.canvas);

        this.context = this.canvas.getContext('2d');
        if (this.context) {
            this.context.strokeStyle = this.trailColor;
            this.context.lineWidth = this.trailWidth;
            this.context.lineCap = this.lineCap;
            this.context.lineJoin = this.lineJoin;
        } else {
            Logger.error('Canvas 2D コンテキストの取得に失敗しました');
            this.clearTrail();
        }

        window.addEventListener('resize', this.handleResize);
    }

    private handleResize = (): void => {
        if (this.canvas) {
            const currentTrail = this.context?.getImageData(0, 0, this.canvas.width, this.canvas.height);
            
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            
            if (this.context) {
                this.context.strokeStyle = this.trailColor;
                this.context.lineWidth = this.trailWidth;
                this.context.lineCap = this.lineCap;
                this.context.lineJoin = this.lineJoin;
                
                if (currentTrail) {
                    this.context.putImageData(currentTrail, 0, 0);
                }
            }
            Logger.debug('ジェスチャトレイル キャンバスリサイズ');
        }
    };

    public destroy(): void {
        this.clearTrail();
        window.removeEventListener('resize', this.handleResize);
        Logger.debug('GestureTrail インスタンス破棄');
    }
} 