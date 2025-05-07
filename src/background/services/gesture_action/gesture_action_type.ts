export const GestureActionType = {
  MAXIMIZE_WINDOW: 'maximizeWindow',
  MINIMIZE_WINDOW: 'minimizeWindow',
  TOGGLE_FULLSCREEN: 'toggleFullscreen',
  NEW_WINDOW: 'newWindow',
  NEW_INCOGNITO_WINDOW: 'newIncognitoWindow',
  CLOSE_WINDOW: 'closeWindow',
  NEW_TAB: 'newTab',
  NEXT_TAB: 'nextTab',
  PREV_TAB: 'prevTab',
  PIN_TAB: 'pinTab',
  MUTE_TAB: 'muteTab',
  CLOSE_TAB: 'closeTab',
  CLOSE_TAB_TO_RIGHT: 'closeTabToRight',
  CLOSE_TAB_TO_LEFT: 'closeTabToLeft',
  DUPLICATE_TAB: 'duplicateTab',
  REOPEN_CLOSED_TAB: 'reopenClosedTab',
} as const;

export type GestureActionType = (typeof GestureActionType)[keyof typeof GestureActionType]; 