import { GestureActionName } from './gesture_action_name';

export class CloseTabGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return 'タブを閉じる';
    }
} 