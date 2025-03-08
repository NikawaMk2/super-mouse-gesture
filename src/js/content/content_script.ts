import ContainerProvider from '../common/util/container_provider';
import MouseGesture from './mouse_gesture/mouse_gesture';

ContainerProvider.initialize();

let mouseGesture: MouseGesture | null = new MouseGesture(document.body);
window.addEventListener('unload', () => {
    if (mouseGesture) {
        mouseGesture.dispose();
        mouseGesture = null;
    }
});