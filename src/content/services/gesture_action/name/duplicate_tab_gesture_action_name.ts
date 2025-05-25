import { GestureActionName } from './gesture_action_name';

export class DuplicateTabGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return 'タブを複製';
    }
} 