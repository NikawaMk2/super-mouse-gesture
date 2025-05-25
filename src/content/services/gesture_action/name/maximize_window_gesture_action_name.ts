import { GestureActionName } from './gesture_action_name';

export class MaximizeWindowGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return 'ウィンドウを最大化';
    }
} 