import { Direction } from "../../direction";
import { DragType } from "../../drag_type";

export interface SuperDragAction {
    execute(options: {
        type: DragType;
        direction: Direction;
        actionName: string;
        params: Record<string, any>;
    }): Promise<void>;
} 