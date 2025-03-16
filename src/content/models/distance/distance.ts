import Logger from '../../../common/utils/logger';

export default class Distance {
    private readonly MIN_MOVE_DISTANCE = 100;

    private distance: number;

    constructor(distance: number) {
        this.distance = distance;
    }

    isLessThanMinimumDistance(): boolean {
        return this.distance < this.MIN_MOVE_DISTANCE;
    }
}