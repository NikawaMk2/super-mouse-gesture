export const DragActionType = {
    SEARCH_GOOGLE: 'searchGoogle',
    SEARCH_BING: 'searchBing',
    OPEN_AS_URL: 'openAsUrl',
    OPEN_IN_BACKGROUND_TAB: 'openInBackgroundTab',
    OPEN_IN_FOREGROUND_TAB: 'openInForegroundTab',
    OPEN_IMAGE_IN_NEW_TAB: 'openImageInNewTab',

    SEARCH_IMAGE_GOOGLE: 'searchImageGoogle',
} as const;

export type DragActionType = (typeof DragActionType)[keyof typeof DragActionType]; 