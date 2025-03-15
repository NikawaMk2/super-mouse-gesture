import ContainerProvider from '../common/utils/container_provider';
import MouseGesture from './handlers/mouse_gesture';

ContainerProvider.initialize();

let mouseGesture: MouseGesture | null = new MouseGesture(document.body);
window.addEventListener('unload', () => {
    if (mouseGesture) {
        mouseGesture.dispose();
        mouseGesture = null;
    }
});