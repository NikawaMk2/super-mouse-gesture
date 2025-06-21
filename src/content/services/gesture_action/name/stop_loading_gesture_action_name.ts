import { GestureActionName } from './gesture_action_name';

export class StopLoadingGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return '読み込み停止';
    }
} 