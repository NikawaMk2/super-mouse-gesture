import { GestureActionName } from './gesture_action_name';

export class NoneGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return 'なし';
    }
} 