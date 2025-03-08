import { GestureType } from '../../common/setting/gesture_setting/gesture_type';
import { ChromeGestureSettingsLoader } from '../../common/setting/gesture_settings/chrome_gesture_settings_loader';
import { GestureSettingsLoader } from '../../common/setting/gesture_settings/gesture_settings_loader';
import Logger from '../../common/util/logger';
import GestureIndicator from '../gesture_indicator/gesture_indicaror';
import DirectionList from './direcrion/direcrion_list';
import { GestureActionFactory } from './gesture_action/gesture_action_factory';
import Point from './point';

export default class MouseGesture {
    private readonly settingsLoader: GestureSettingsLoader = new ChromeGestureSettingsLoader();
    private isDragging: boolean = false;
    private gestureStart: Point | null = null;
    private lastDirectionPoint: Point | null = null;
    private movementHistory: DirectionList = new DirectionList([]);

    private gestureIndicator: GestureIndicator = new GestureIndicator();

    constructor(private element: HTMLElement) {
        if (!this.element) {
            Logger.error('elementが設定されていません');
            return;
        }

        this.element.addEventListener('mousedown', this.handleMouseDown);
        this.element.addEventListener('mousemove', this.handleMouseMove);
        this.element.addEventListener('mouseup', this.handleMouseUp);
        this.element.addEventListener('mouseleave', this.handleMouseUp);
    }

    public dispose() {
        this.element.removeEventListener('mousedown', this.handleMouseDown);
        this.element.removeEventListener('mousemove', this.handleMouseMove);
        this.element.removeEventListener('mouseup', this.handleMouseUp);
        this.element.removeEventListener('mouseleave', this.handleMouseUp);
    }
    
    private handleMouseDown = (event: MouseEvent) => {
        this.isDragging = true;
        this.movementHistory.clear();
        this.gestureStart = new Point(event);
        this.lastDirectionPoint = this.gestureStart;

        this.gestureIndicator.reset();

        Logger.debug('ジェスチャ開始');
    };

    private handleMouseMove = (event: MouseEvent) => {
        if (!this.isDragging) {
            return;
        }

        const currentPoint: Point = new Point(event);

        // 最後に方向を判定した位置からの移動距離を計算
        const distance = currentPoint.getDistance(this.lastDirectionPoint || currentPoint);
        if (distance.isLessThanMinimumDistance()) {
            return; // 十分な移動がない場合は方向判定しない
        }

        // 新しい方向を判定
        const newDirection = currentPoint.getDirection(this.lastDirectionPoint);
        this.movementHistory.pushNewDirection(newDirection);

        this.lastDirectionPoint = currentPoint;

        this.updateGestureIndicator();
    };

    private handleMouseUp = (_event: MouseEvent) => {
        if (!this.isDragging) {
            return;
        }

        this.isDragging = false;
        this.gestureStart = null;
        this.lastDirectionPoint = null;

        Logger.debug('ジェスチャ終了');
        this.executeGesture();

        this.gestureIndicator.clear();
    };

    private async updateGestureIndicator() {
        Logger.debug(`移動方向: ${this.movementHistory.toString()}`);
        const gestureType = await this.getGestureType();
        this.gestureIndicator.update(GestureType[gestureType] || '');
    }

    private async executeGesture() {
        Logger.debug(`移動方向: ${this.movementHistory.toString()}`);
        const gestureType = await this.getGestureType();
        const gestureAction = GestureActionFactory.createGestureAction(gestureType);
        gestureAction.doAction();
    }

    private async getGestureType(): Promise<GestureType> {
        const settings = await this.settingsLoader.getSettings();
        return settings.getGestureType(this.movementHistory);
    }
}
