import Logger from "../../common/logger/logger";
import { Direction } from "./direction";

export class Point {
    static readonly NONE = new Point(NaN, NaN);

    private readonly THRESHOLD = 30;

    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getDirection(to: Point): Direction {
        if (this.isNone()) {
            Logger.warn('Point.NONEに対してgetDirectionが呼び出されました');
            return Direction.NONE;
        }
        if (to.isNone()) {
            Logger.warn('Point.NONEがgetDirectionの引数に指定されました');
            return Direction.NONE;
        }

        const dx = to.getX() - this.getX();
        const dy = to.getY() - this.getY();

        if (Math.abs(dx) >= Math.abs(dy)) {
            if (dx > this.THRESHOLD) return Direction.RIGHT;
            if (dx < -this.THRESHOLD) return Direction.LEFT;
        } else {
            if (dy > this.THRESHOLD) return Direction.DOWN;
            if (dy < -this.THRESHOLD) return Direction.UP;
        }
        return Direction.NONE;
    }

    public isNone(): boolean {
        return isNaN(this.x) || isNaN(this.y);
    }
}
