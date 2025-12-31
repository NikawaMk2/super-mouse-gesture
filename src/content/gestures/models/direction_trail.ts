import { GestureDirection } from "../../../shared/types/gesture-direction";

/**
 * マウスジェスチャの方向履歴を管理するクラス
 */
export class DirectionTrail {
    private directions: Array<GestureDirection> = [];

    /**
     * 新しい方向を追加する
     * 同じ方向が連続する場合は追加しない
     * @param direction 追加する方向
     */
    public add(direction: GestureDirection): void {
        if (this.getLastDirection() === direction) {
            return;
        }

        this.directions.push(direction);
    }

    /**
     * 最後の方向を取得する
     * @returns 最後の方向。履歴が空の場合はundefined
     */
    private getLastDirection(): GestureDirection | undefined {
        return this.directions[this.directions.length - 1];
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
     * 方向履歴をジェスチャパス文字列に変換する
     * @returns ジェスチャパス文字列（例: "U", "LR"）。空の場合は空文字列
     */
    public toPath(): string {
        return this.directions.join('');
    }
}