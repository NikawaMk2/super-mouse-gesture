// ウィンドウ操作用インターフェース
export interface IWindowOperator {
    maximizeCurrentWindow(): Promise<void>;
    minimizeCurrentWindow(): Promise<void>;
    toggleFullscreenCurrentWindow(): Promise<void>;
    createNewWindow(): Promise<void>;
    createNewIncognitoWindow(): Promise<void>;
    closeCurrentWindow(): Promise<void>;
    // 今後の拡張用に他のwindow操作もここに追加予定
} 