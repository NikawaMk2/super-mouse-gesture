import { GestureActionName } from './gesture_action_name';

export class MuteTabGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return 'タブをミュート';
    }
} 