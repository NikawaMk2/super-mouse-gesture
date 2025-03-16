import '../common/utils/reflect_metadata';
import MouseGesture from './handlers/mouse_gesture';
import ContainerProvider from '../common/utils/container_provider';

console.log('Content script loaded');

// コンテナを初期化
const container = ContainerProvider.getContentScriptContainer();
console.log('Container initialized');

let mouseGesture: MouseGesture | null = null;

try {
    // DOMの準備ができているか確認
    if (document.readyState === 'loading') {
        // まだDOMが読み込み中の場合
        document.addEventListener('DOMContentLoaded', () => {
            console.log('Initializing mouse gesture (DOMContentLoaded)');
            mouseGesture = new MouseGesture(document.body);
        });
    } else {
        // すでにDOMの読み込みが完了している場合
        console.log('Initializing mouse gesture (immediate)');
        mouseGesture = new MouseGesture(document.body);
    }
} catch (error) {
    console.error('Error initializing mouse gesture:', error);
}
