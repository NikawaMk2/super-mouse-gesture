import { DragType } from "../models/drag_type";

export class DragContext {
    public static readonly TAGNAME_A = 'A';
    public static readonly TAGNAME_IMG = 'IMG';
    public static readonly CSS_SELECTOR_A = 'a';

    constructor(
        public readonly dragType: DragType,
        public readonly selectedValue: string
    ) {
    }

    public static create(e: MouseEvent): DragContext {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
            return new DragContext(DragType.TEXT, selection.toString());
        }

        const target = e.target as HTMLElement;
        if (target.tagName === DragContext.TAGNAME_A) {
            return new DragContext(DragType.LINK, (target as HTMLAnchorElement).href);
        } else if (target.tagName === DragContext.TAGNAME_IMG) {
            return new DragContext(DragType.IMAGE, (target as HTMLImageElement).src);
        }

        // 子要素に<a>タグがあるかチェック
        const child = target.querySelector(DragContext.CSS_SELECTOR_A);
        if (child) {
            return new DragContext(DragType.LINK, (child as HTMLAnchorElement).href);
        }
        // 親要素に<a>タグがあるかチェック
        const parent = target.closest(DragContext.CSS_SELECTOR_A);
        if (parent) {
            return new DragContext(DragType.LINK, (parent as HTMLAnchorElement).href);
        }

        return DragContext.default();
    }

    public static default(): DragContext {
        return new DragContext(DragType.NONE, '');
    }

    public isValid(): boolean {
        return this.dragType !== DragType.NONE && this.selectedValue !== '';
    }
}