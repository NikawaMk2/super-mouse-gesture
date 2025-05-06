// マウスジェスチャーアクションの種類を表すenum
export enum GestureActionType {
    MAXIMIZE_WINDOW = 'maximize_window',
    MINIMIZE_WINDOW = 'minimize_window',
    TOGGLE_FULLSCREEN = 'toggle_fullscreen',
    NEW_WINDOW = 'new_window',
    NEW_INCOGNITO_WINDOW = 'new_incognito_window',
    CLOSE_WINDOW = 'close_window',
    NEW_TAB = 'new_tab',
    NEXT_TAB = 'next_tab',
    PREV_TAB = 'prev_tab',
    PIN_TAB = 'pin_tab',
    MUTE_TAB = 'mute_tab',
    CLOSE_TAB = 'close_tab',
    CLOSE_TAB_TO_RIGHT = 'close_tab_to_right',
    CLOSE_TAB_TO_LEFT = 'close_tab_to_left',
    DUPLICATE_TAB = 'duplicate_tab',
    REOPEN_CLOSED_TAB = 'reopen_closed_tab',
} 