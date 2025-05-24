import { DragType } from "../models/drag_type";

export class DragContext {
    public static readonly TAGNAME_A = 'A';
    public static readonly TAGNAME_IMG = 'IMG';

    constructor(
        public readonly dragType: DragType,
        public readonly selectedValue: string
    ) {
    }

    public static create(e: MouseEvent): DragContext {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
            return new DragContext(DragType.TEXT, selection.toString());
        } else if ((e.target as HTMLElement).tagName === DragContext.TAGNAME_A) {
            return new DragContext(DragType.LINK, (e.target as HTMLAnchorElement).href);
        } else if ((e.target as HTMLElement).tagName === DragContext.TAGNAME_IMG) {
            return new DragContext(DragType.IMAGE, (e.target as HTMLImageElement).src);
        } else {
            return DragContext.default();
        }
    }

    public static default(): DragContext {
        return new DragContext(DragType.NONE, '');
    }

    public isValid(): boolean {
        return this.dragType !== DragType.NONE && this.selectedValue !== '';
    }
}