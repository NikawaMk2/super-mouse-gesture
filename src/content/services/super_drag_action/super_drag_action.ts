import { Direction } from "../../models/direction";
import { DragType } from "../../models/drag_type";

export interface SuperDragAction {
    execute(options: {
        type: DragType;
        direction: Direction;
        actionName: string;
        params: Record<string, any>;
        selectedValue: string;
    }): Promise<void>;
} 