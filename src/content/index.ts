import MouseGesture from './handlers/mouse_gesture';

let mouseGesture: MouseGesture | null = new MouseGesture(document.body);
window.addEventListener('unload', () => {
    if (mouseGesture) {
        mouseGesture.dispose();
        mouseGesture = null;
    }
});