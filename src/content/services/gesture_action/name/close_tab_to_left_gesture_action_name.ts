import { GestureActionName } from './gesture_action_name';

export class CloseTabToLeftGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return 'このタブを閉じて左のタブに移動';
    }
} 