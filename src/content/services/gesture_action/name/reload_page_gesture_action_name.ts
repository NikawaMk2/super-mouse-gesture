import { GestureActionName } from './gesture_action_name';

export class ReloadPageGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return '再読み込み';
    }
} 