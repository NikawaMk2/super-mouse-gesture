import { GestureActionName } from './gesture_action_name';

export class PinTabGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return 'タブをピン留め';
    }
} 