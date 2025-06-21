import { GestureActionName } from './gesture_action_name';

export class NewWindowGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return '新しいウィンドウを開く';
    }
} 