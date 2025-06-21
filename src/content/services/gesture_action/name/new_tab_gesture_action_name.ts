import { GestureActionName } from './gesture_action_name';

export class NewTabGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return '新しいタブ';
    }
} 