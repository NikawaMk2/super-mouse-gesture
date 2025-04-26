// Content Script → Background Script メッセージ
export type ContentToBackgroundMessage =
  | { action: 'getSettings' }
  | { action: 'executeGestureAction', payload: {
      actionName: string,
      params: Record<string, unknown>
    } }
  | { action: 'executeDragAction', payload: {
      type: 'text' | 'link' | 'image',
      direction: 'up' | 'right' | 'down' | 'left',
      actionName: string,
      params: Record<string, unknown>,
      sourceTabId: number
    } }
  | { action: 'updateHistory', payload: {
      gestureId: string,
      pattern: string,
      actionName: string
    } };

// Background Script → Content Script メッセージ
export type BackgroundToContentMessage =
  | { action: 'settingsUpdated', payload: Record<string, unknown> }
  | { action: 'toggleEnabled', payload: { enabled: boolean } };

// Content Script ← Background Script レスポンス
export type ContentToBackgroundResponse =
  | { action: 'settingsResponse', payload: Record<string, unknown> }
  | { action: 'actionResult', payload: { success: boolean, message?: string } }; 