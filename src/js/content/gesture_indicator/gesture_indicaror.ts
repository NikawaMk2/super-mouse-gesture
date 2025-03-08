export default class GestureIndicator {
    private gestureIndicator: HTMLElement;
    private currentGesture: string = '';

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
        // TODO: 実装する
        //document.body.appendChild(this.gestureIndicator);
    }

    reset() {
        this.currentGesture = '';
        this.gestureIndicator.textContent = '';
    }

    update(gesture: string) {
        this.currentGesture = gesture;
        this.gestureIndicator.textContent = `Current Gesture: ${this.currentGesture}`;
    }

    clear() {
        this.gestureIndicator.textContent = '';
    }
}