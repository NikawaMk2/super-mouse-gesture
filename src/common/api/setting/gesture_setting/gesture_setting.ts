import DirectionList from '../../../../content/handlers/direcrion/direcrion_list';
import { GestureType } from './gesture_type';

export default class GestureSetting {
    gestureType: GestureType;
    private directions: DirectionList;

    constructor(gestureType: GestureType, directions: DirectionList) {
        this.gestureType = gestureType;
        this.directions = directions;
    }

    isDirectionsEqual(directions: DirectionList): boolean {
        return this.directions.equals(directions);
    }
}