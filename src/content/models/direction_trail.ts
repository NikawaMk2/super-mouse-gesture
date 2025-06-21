import { Direction } from './direction';

/**
 * マウスジェスチャの方向履歴を管理するクラス
 * 責務：方向の追加、パターン文字列化、履歴管理
 */
export class DirectionTrail {
    private directions: Array<Direction> = [];

    /**
     * 新しい方向を追加する
     * 同じ方向が連続する場合は追加しない
     * @param direction 追加する方向
     */
    public add(direction: Direction): void {
        if (direction === Direction.NONE) {
            return;
        }
        
        if (this.getLastDirection() !== direction) {
            this.directions.push(direction);
        }
    }

    /**
     * 最後の方向を取得する
     * @returns 最後の方向。履歴が空の場合はundefined
     */
    public getLastDirection(): Direction | undefined {
        return this.directions[this.directions.length - 1];
    }

    /**
     * 方向履歴をパターン文字列に変換する
     * @returns カンマ区切りの方向文字列
     */
    public toPattern(): string {
        return this.directions.join(',');
    }

    /**
     * 方向履歴の長さを取得する
     * @returns 履歴の長さ
     */
    public getLength(): number {
        return this.directions.length;
    }

    /**
     * 方向履歴が空かどうかを判定する
     * @returns 空の場合はtrue
     */
    public isEmpty(): boolean {
        return this.directions.length === 0;
    }

    /**
     * 方向履歴をリセットする
     */
    public reset(): void {
        this.directions = [];
    }

    /**
     * 方向履歴の配列のコピーを取得する
     * @returns 方向配列のコピー
     */
    public toArray(): ReadonlyArray<Direction> {
        return [...this.directions];
    }
} 