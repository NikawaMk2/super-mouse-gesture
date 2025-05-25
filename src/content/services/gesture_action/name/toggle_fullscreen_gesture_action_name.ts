import { GestureActionName } from './gesture_action_name';

export class ToggleFullscreenGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return 'フルスクリーンモードを切り替える';
    }
} 