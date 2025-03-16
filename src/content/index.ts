import '../common/utils/reflect_metadata';
import MouseGesture from './handlers/mouse_gesture';

console.log('Content script loaded');

let mouseGesture: MouseGesture | null = null;

// トップレベルフレームでのみ初期化を行う
const shouldInitialize = () => {
    return window.self === window.top;
};

// マウスジェスチャーの初期化関数
const initializeMouseGesture = () => {
    // トップレベルフレーム以外では初期化しない
    if (!shouldInitialize()) {
        console.log('Skipping initialization in non-top frame');
        return;
    }

    // 既存のインスタンスがある場合は初期化しない
    if (mouseGesture) {
        console.log('Mouse gesture already initialized');
        return;
    }

    try {
        console.log('Initializing mouse gesture');
        mouseGesture = new MouseGesture(document.body);
    } catch (error) {
        console.error('Error initializing mouse gesture:', error);
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
    }
};

// ページのアンロード時にクリーンアップを実行
window.addEventListener('unload', cleanup, { once: true });
