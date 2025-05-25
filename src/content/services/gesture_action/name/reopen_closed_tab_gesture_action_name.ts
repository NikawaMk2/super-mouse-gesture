import { GestureActionName } from './gesture_action_name';

export class ReopenClosedTabGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return '閉じたタブを再開';
    }
} 