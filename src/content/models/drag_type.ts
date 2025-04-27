export const DragType = {
    TEXT: 'text',
    LINK: 'link',
    IMAGE: 'image',
    NONE: 'none',
} as const;

export type DragType = typeof DragType[keyof typeof DragType];