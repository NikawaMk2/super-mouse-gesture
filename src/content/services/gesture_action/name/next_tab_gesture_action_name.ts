import { GestureActionName } from './gesture_action_name';

export class NextTabGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return '右のタブに移動';
    }
} 