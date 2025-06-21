import { SuperDragActionName } from './super_drag_action_name';

export class OpenAsUrlSuperDragActionName implements SuperDragActionName {
    public getJapaneseName(): string {
        return 'URLとして開く';
    }
} 