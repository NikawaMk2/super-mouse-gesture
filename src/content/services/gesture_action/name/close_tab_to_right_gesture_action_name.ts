import { GestureActionName } from './gesture_action_name';

export class CloseTabToRightGestureActionName implements GestureActionName {
    public getJapaneseName(): string {
        return 'このタブを閉じて右のタブに移動';
    }
} 