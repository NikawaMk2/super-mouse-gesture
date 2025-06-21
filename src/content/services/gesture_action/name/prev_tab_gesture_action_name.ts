import { GestureActionName } from './gesture_action_name';

export class PrevTabGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return '左のタブに移動';
    }
} 