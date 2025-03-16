import { Gesture, GestureType } from '../../common/api/setting/gesture_setting/gesture_type';
import Logger from '../../common/utils/logger';

export default class GestureIndicator {
    private gestureIndicator: HTMLElement;
    private currentGesture: GestureType = Gesture.None;
    private contextMenuEnabled: boolean = true;

    constructor() {
        // ジェスチャーの表示領域を作成
        this.gestureIndicator = document.createElement('div');
        this.gestureIndicator.style.position = 'fixed';
        this.gestureIndicator.style.top = '10px';
        this.gestureIndicator.style.left = '10px';
        this.gestureIndicator.style.padding = '10px';
        this.gestureIndicator.style.background = 'rgba(0, 0, 0, 0.7)';
        this.gestureIndicator.style.color = 'white';
        this.gestureIndicator.style.zIndex = '9999';
        document.body.appendChild(this.gestureIndicator);
        
        Logger.debug('ジェスチャーインジケーター初期化完了');
    }

    reset() {
        this.currentGesture = Gesture.None;
        this.gestureIndicator.textContent = '';
        this.contextMenuEnabled = false;
    }

    update(gesture: GestureType) {
        this.currentGesture = gesture;
        this.gestureIndicator.textContent = `Current Gesture: ${this.currentGesture}`;
    }

    clear() {
        this.gestureIndicator.textContent = '';
        this.contextMenuEnabled = true;
    }

    isContextMenuEnabled(): boolean {
        return this.contextMenuEnabled;
    }
}