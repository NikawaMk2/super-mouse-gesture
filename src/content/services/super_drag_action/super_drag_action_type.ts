export const SuperDragActionType = {
    SEARCH_GOOGLE: 'searchGoogle',
    SEARCH_BING: 'searchBing',
    OPEN_AS_URL: 'openAsUrl',
    COPY_TEXT: 'copyText',
    OPEN_IN_BACKGROUND_TAB: 'openInBackgroundTab',
    OPEN_IN_FOREGROUND_TAB: 'openInForegroundTab',
    COPY_LINK_URL: 'copyLinkUrl',
    OPEN_IMAGE_IN_NEW_TAB: 'openImageInNewTab',
    SEARCH_IMAGE_GOOGLE: 'searchImageGoogle',
    COPY_IMAGE_URL: 'copyImageUrl',
    NONE: 'none',
} as const;

export type SuperDragActionType = (typeof SuperDragActionType)[keyof typeof SuperDragActionType]; 