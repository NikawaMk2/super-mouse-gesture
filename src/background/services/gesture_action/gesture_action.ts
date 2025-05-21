// マウスジェスチャーアクションのインターフェース
export interface IGestureAction {
    execute(): Promise<void>;
} 