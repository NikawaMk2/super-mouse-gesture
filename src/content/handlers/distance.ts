export default class Distance {
    private readonly MIN_MOVE_DISTANCE = 10;

    private distance: number;

    constructor(distance: number) {
        this.distance = distance;
    }

    isLessThanMinimumDistance(): boolean {
        return this.distance < this.MIN_MOVE_DISTANCE;
    }
}