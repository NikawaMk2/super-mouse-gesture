import Logger from '../../common/logger/logger';
import { Point } from '../models/point';
import { GestureActionFactory } from '../services/gesture_action/gesture_action_factory';
import { GestureActionType } from '../services/gesture_action/gesture_action_type';
import { Direction } from '../models/direction';
import { MouseGestureSettingsService } from '../services/gesture_action/settings/mouse_gesture_settings_service';
import { DEFAULT_MOUSE_GESTURE_SETTINGS } from '../../common/constants/mouse_gesture_settings';

export class MouseGestureHandler {
    private isGesture: boolean = false;
    private gestureTrail: Array<Point> = [];
    private directionTrail: Array<Direction> = [];
    private mouseGestureSettingsService: MouseGestureSettingsService;

    constructor(mouseGestureSettingsService: MouseGestureSettingsService) {
        this.mouseGestureSettingsService = mouseGestureSettingsService;
    }

    public onMouseDown(e: MouseEvent) {
        this.isGesture = true;
        this.gestureTrail = [new Point(e.clientX, e.clientY)];
        this.directionTrail = [];
        Logger.debug('マウスジェスチャ開始', { x: e.clientX, y: e.clientY });
        // TODO: ジェスチャトレイル描画開始（UI表示クラス呼び出し）
    }

    public onMouseMove(e: MouseEvent) {
        if (!this.isGesture) return;
        const lastPoint = this.gestureTrail[this.gestureTrail.length - 1];
        const currentPoint = new Point(e.clientX, e.clientY);
        const direction = lastPoint.getDirection(currentPoint);
        if (direction && this.directionTrail[this.directionTrail.length - 1] !== direction) {
            this.directionTrail.push(direction);
        }
        this.gestureTrail.push(currentPoint);
        // TODO: ジェスチャトレイル描画更新（UI表示クラス呼び出し）
    }

    public async onMouseUp(e: MouseEvent) {
        if (!this.isGesture) return;
        this.isGesture = false;
        // TODO: ジェスチャトレイル描画終了・クリア（UI表示クラス呼び出し）
        const pattern = await this.analyzeGesturePattern(this.directionTrail);
        if (pattern) {
            Logger.info('ジェスチャパターン認識', { pattern });
            try {
                const action = GestureActionFactory.create(pattern) as { execute: () => void };
                action.execute();
                // TODO: アクション通知表示（UI表示クラス呼び出し）
            } catch (err) {
                Logger.warn('未対応のジェスチャパターン', { pattern });
            }
        }
        this.gestureTrail = [];
        this.directionTrail = [];
    }

    public onContextMenu(e: MouseEvent) {
        if (!this.isGesture) return;
        e.preventDefault();
        Logger.debug('右クリックメニュー抑制');
    }

    public isActive(): boolean {
        return this.isGesture;
    }

    // パターン解析: 方向列を文字列化し、設定値からアクション名を返す
    public async analyzeGesturePattern(directionTrail: Array<Direction>): Promise<GestureActionType> {
        const pattern = directionTrail.join(',');
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