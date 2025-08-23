import { SuperDragActionName } from './super_drag_action_name';

export class NoneSuperDragActionName implements SuperDragActionName {
    public getJapaneseName(): string {
        return 'なし';
    }
} 