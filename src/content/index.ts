import '../common/utils/reflect_metadata';
import MouseGesture from './handlers/mouse_gesture';
import Logger from '../common/utils/logger';

Logger.debug('コンテンツスクリプト初期化開始');

let mouseGesture: MouseGesture | null = null;

// トップレベルフレームでのみ初期化を行う
const shouldInitialize = () => {
    return window.self === window.top;
};

// マウスジェスチャーの初期化関数
const initializeMouseGesture = () => {
    // トップレベルフレーム以外では初期化しない
    if (!shouldInitialize()) {
        Logger.debug('非トップフレームでは初期化をスキップ');
        return;
    }

    // 既存のインスタンスがある場合は初期化しない
    if (mouseGesture) {
        Logger.debug('マウスジェスチャーは既に初期化済み');
        return;
    }

    try {
        Logger.debug('マウスジェスチャー初期化開始');
        mouseGesture = new MouseGesture(document.body);
        Logger.debug('マウスジェスチャー初期化完了');
    } catch (error) {
        Logger.error(`マウスジェスチャー初期化エラー: ${error}`);
    }
};

// DOMの準備ができているか確認
if (document.readyState === 'loading') {
    // まだDOMが読み込み中の場合は一度だけイベントリスナーを追加
    document.addEventListener('DOMContentLoaded', initializeMouseGesture, { once: true });
} else {
    // すでにDOMの読み込みが完了している場合は即時初期化
    initializeMouseGesture();
}

// クリーンアップ処理
const cleanup = () => {
    if (mouseGesture) {
        mouseGesture.dispose();
        mouseGesture = null;
        Logger.debug('マウスジェスチャークリーンアップ完了');
    }
};

// ページのアンロード時にクリーンアップを実行
window.addEventListener('unload', cleanup, { once: true });
