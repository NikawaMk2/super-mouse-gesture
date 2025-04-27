// Content Script → Background Script メッセージ
export type ContentToBackgroundMessage =
  | { action: 'getSettings' }
  | { action: 'executeGestureAction', payload: GestureActionMessagePayload }
  | { action: 'executeDragAction', payload: DragActionMessagePayload }
  | { action: 'updateHistory', payload: {
      gestureId: string,
      pattern: string,
      actionName: string
    } };

// Background Script → Content Script メッセージ
export type BackgroundToContentMessage =
  | { action: 'settingsUpdated', payload: Record<string, unknown> }
  | { action: 'toggleEnabled', payload: { enabled: boolean } };

// Content Script(ジェスチャアクション) → Background Script メッセージペイロード
export interface GestureActionMessagePayload {
    actionName: string;
    params: Record<string, any>;
}

// Content Script(スーパードラッグアクション) → Background Script メッセージペイロード
export interface DragActionMessagePayload {
    type: 'text' | 'link' | 'image';
    direction: 'up' | 'right' | 'down' | 'left';
    actionName: string;
    params: Record<string, any>;
    [key: string]: any;
}


// Content Script ← Background Script レスポンス
export type ContentToBackgroundResponse =
  | { action: 'settingsResponse', payload: Record<string, unknown> }
  | { action: 'actionResult', payload: { success: boolean, message?: string } }; 