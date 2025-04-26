import { GestureAction } from './gesture_action';
import Logger from '../../../common/logger/logger';

export class ZoomInGestureAction implements GestureAction {
    execute(): void {
        Logger.debug('ZoomInGestureAction: execute() が呼び出されました');
        const currentZoom = Number(document.body.style.zoom) || 1;
        document.body.style.zoom = String(currentZoom + 0.1);
    }
} 