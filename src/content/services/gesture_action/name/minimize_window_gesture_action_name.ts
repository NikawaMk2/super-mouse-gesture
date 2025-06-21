import { GestureActionName } from './gesture_action_name';

export class MinimizeWindowGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return 'ウィンドウを最小化';
    }
} 