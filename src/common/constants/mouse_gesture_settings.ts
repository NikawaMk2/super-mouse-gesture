import { GestureActionType } from '../../content/services/gesture_action/gesture_action_type';

export type MouseGestureSettings = {
  [pattern: string]: GestureActionType;
};

export const DEFAULT_MOUSE_GESTURE_SETTINGS: MouseGestureSettings = {
  'left': 'goBack',
  'right': 'forward',
  'up': 'scrollToTop',
  'down': 'scrollToBottom',
  'up,left': 'prevTab',
  'up,right': 'nextTab',
  'down,left': 'closeTabToLeft',
  'down,right': 'closeTabToRight',
  'left,up': 'zoomIn',
  'left,down': 'zoomOut',
  'right,up': 'newTab',
  'right,down': 'toggleFullscreen',
  'up,down': 'scrollToBottom',
  'down,up': 'scrollToTop',
  'left,right': 'reloadPage',
  'right,left': 'reopenClosedTab',
}; 