import { Direction, DirectionType } from './direcrion/direction';
import Distance from './distance';

export default class Point {
    private x: number;
    private y: number;

    constructor(event: MouseEvent) {
        this.x = event.clientX;
        this.y = event.clientY;
    }

    getDistance(destination: Point): Distance {
        const dx = this.x - destination.x;
        const dy = this.y - destination.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return new Distance(distance);
    }

    getDirection(destination: Point | null): DirectionType {
        if (!destination) {
            return Direction.None;
        }

        const dx = destination.x - this.x;
        const dy = destination.y - this.y;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        if (this.isVerticalMovement(angle)) {
            return this.isRightMovement(dx) ? Direction.Right : Direction.Left;
        } else {
            return this.isDownMovement(dy) ? Direction.Down : Direction.Up;
        }
    }

    private isVerticalMovement(angle: number): boolean {
        return Math.abs(angle) > 45 && Math.abs(angle) < 135;
    }

    private isRightMovement(dx: number): boolean {
        return dx > 0;
    }

    private isDownMovement(dy: number): boolean {
        return dy > 0;
    }
}
