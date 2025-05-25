import { GestureActionName } from './gesture_action_name';

export class CloseWindowGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return 'ウィンドウを閉じる';
    }
} 