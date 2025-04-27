import Logger from '../common/logger/logger';
import { MouseGestureHandler } from './handlers/mouse_gesture_handler';
import { SuperDragHandler } from './handlers/super_drag_handler';
import { MouseButton } from '../common/constants/mouse_button';
import { ChromeStorageSettingsRepository } from '../common/storage/chrome_storage_settings_repository';
import { SuperDragSettingsService } from './services/super_drag_action/settings/super_drag_settings_service';
import { MouseGestureSettingsService } from './services/gesture_action/settings/mouse_gesture_settings_service';

export class ContentScriptMain {
    private mouseGestureHandler: MouseGestureHandler;
    private superDragHandler: SuperDragHandler;

    constructor() {
        const settingsRepository = new ChromeStorageSettingsRepository();
        const mouseGestureSettingsService = new MouseGestureSettingsService(settingsRepository);
        const superDragSettingsService = new SuperDragSettingsService(settingsRepository);
        this.mouseGestureHandler = new MouseGestureHandler(mouseGestureSettingsService);
        this.superDragHandler = new SuperDragHandler(superDragSettingsService);
        this.addEventListeners();
        Logger.debug('ContentScriptMain: イベントリスナーを設定');
    }

    private addEventListeners() {
        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('contextmenu', this.onContextMenu, true);
        document.addEventListener('dragstart', this.onDragStart);
        document.addEventListener('drag', this.onDrag);
        document.addEventListener('dragend', this.onDragEnd);
    }

    private onMouseDown = (e: MouseEvent) => {
        switch(e.button) {
            case MouseButton.RIGHT:
                this.mouseGestureHandler.onMouseDown(e);
                break;
            case MouseButton.LEFT:
                this.superDragHandler.onMouseDown(e);
                break;
            default:
                break;
        }
    };

    private onMouseMove = (e: MouseEvent) => {
        this.mouseGestureHandler.onMouseMove(e);
        // スーパードラッグのドラッグ方向UI表示はdragイベントで行うため、ここでは何もしない
    };

    private onMouseUp = (e: MouseEvent) => {
        this.mouseGestureHandler.onMouseUp(e);
        // スーパードラッグの終了処理はdragendイベントで行うため、ここでは何もしない
    };

    private onContextMenu = (e: MouseEvent) => {
        this.mouseGestureHandler.onContextMenu(e);
    };

    private onDragStart = (e: DragEvent) => {
        this.superDragHandler.onDragStart(e);
    };

    private onDrag = (e: DragEvent) => {
        this.superDragHandler.onDrag(e);
    };

    private onDragEnd = async (e: DragEvent) => {
        await this.superDragHandler.onDragEnd(e);
    };
} 