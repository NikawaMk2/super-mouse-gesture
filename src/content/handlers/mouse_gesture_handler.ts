import Logger from '../../common/logger/logger';
import { Point } from '../models/point';
import { GestureActionFactory } from '../services/gesture_action/gesture_action_factory';
import { GestureActionType } from '../services/gesture_action/gesture_action_type';
import { Direction } from '../models/direction';
import { DirectionTrail } from '../models/direction_trail';
import { MouseGestureSettingsService } from '../services/gesture_action/settings/mouse_gesture_settings_service';
import { DEFAULT_MOUSE_GESTURE_SETTINGS } from '../../common/constants/mouse_gesture_settings';
import { GestureTrail } from './gesture_trail';
import { ActionNotification } from './action_notification';

export class MouseGestureHandler {
    private isGesture: boolean = false;
    private wasGestureRecognized: boolean = false;
    private gestureTrail: Array<Point> = [];
    private directionTrail: DirectionTrail = new DirectionTrail();
    private mouseGestureSettingsService: MouseGestureSettingsService;
    private gestureTrailRenderer: GestureTrail;

    constructor(mouseGestureSettingsService: MouseGestureSettingsService) {
        this.mouseGestureSettingsService = mouseGestureSettingsService;
        this.gestureTrailRenderer = new GestureTrail({
            color: 'rgba(255, 0, 0, 0.5)',
            width: 3,
            zIndex: 999999
        });
    }

    public onMouseDown(e: MouseEvent) {
        this.isGesture = true;
        this.wasGestureRecognized = false;
        this.gestureTrail = [new Point(e.clientX, e.clientY)];
        this.directionTrail.reset();
        Logger.debug('マウスジェスチャ開始', { x: e.clientX, y: e.clientY });
        this.gestureTrailRenderer.startDrawing(new Point(e.clientX, e.clientY));
    }

    public onMouseMove(e: MouseEvent) {
        if (!this.isGesture) return;
        const lastPoint = this.gestureTrail[this.gestureTrail.length - 1];
        const currentPoint = new Point(e.clientX, e.clientY);
        const direction = lastPoint.getDirection(currentPoint);
        this.directionTrail.add(direction);
        this.gestureTrail.push(currentPoint);
        this.gestureTrailRenderer.updateTrail(currentPoint);

        // アクション名をリアルタイム表示
        this.analyzeGesturePattern(this.directionTrail).then((pattern) => {
            if (!pattern) {
                ActionNotification.hide();
                return;
            }

            this.wasGestureRecognized = pattern !== GestureActionType.NONE;
            ActionNotification.showMouseGestureHandler(pattern);
        });
    }

    public async onMouseUp(e: MouseEvent) {
        if (!this.isGesture) return;
        this.isGesture = false;
        this.gestureTrailRenderer.clearTrail();
        const pattern = await this.analyzeGesturePattern(this.directionTrail);
        if (pattern !== GestureActionType.NONE) {
            Logger.debug('ジェスチャパターン認識', { pattern });
            try {
                const action = GestureActionFactory.create(pattern, new (require('../provider/content_container_provider').ContentContainerProvider)().getContainer()) as { execute: () => void };
                action.execute();
                // アクション通知UIを非表示
                ActionNotification.hide();
            } catch (err) {
                Logger.warn('未対応のジェスチャパターン', { pattern });
                ActionNotification.hide();
            }
        } else {
            ActionNotification.hide();
        }
        this.gestureTrail = [];
        this.directionTrail.reset();
    }

    public onContextMenu(e: MouseEvent) {
        if (!this.wasGestureRecognized) {
            return;
        }
        e.preventDefault();
    }

    public isActive(): boolean {
        return this.isGesture;
    }

    public destroy(): void {
        this.gestureTrailRenderer.destroy();
        ActionNotification.destroy();
        Logger.debug('MouseGestureHandler インスタンス破棄');
    }

    // パターン解析: 方向列を文字列化し、設定値からアクション名を返す
    public async analyzeGesturePattern(directionTrail: DirectionTrail): Promise<GestureActionType> {
        if (directionTrail.isEmpty()) {
            return GestureActionType.NONE;
        }

        const pattern = directionTrail.toPattern();
        let settings = await this.mouseGestureSettingsService.getSettings();
        if (!settings) {
            Logger.warn('設定値が取得できませんでした。デフォルト設定を使用します。', { pattern });
            return DEFAULT_MOUSE_GESTURE_SETTINGS[pattern];
        }

        const action = settings[pattern];
        if (!action || !Object.values(GestureActionType).includes(action)) {
            Logger.debug('ジェスチャパターン無し', { pattern });
            return GestureActionType.NONE;
        }

        return action;
    }
} 