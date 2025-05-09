import Logger from '../../common/logger/logger';
import { SuperDragActionFactory } from '../services/super_drag_action/super_drag_action_factory';
import { SuperDragActionType } from '../services/super_drag_action/super_drag_action_type';
import { Point } from '../models/point';
import { Direction } from '../models/direction';
import { DragType } from '../models/drag_type';
import { SuperDragSettingsService } from '../services/super_drag_action/settings/super_drag_settings_service';
import { GestureTrail } from './gesture_trail';
import { ActionNotification } from './action_notification';

export class SuperDragHandler {
    private isDrag: boolean = false;
    private dragStartPos: Point = Point.NONE;
    private dragType: DragType = DragType.NONE;
    private superDragSettingsService: SuperDragSettingsService;
    private gestureTrailRenderer: GestureTrail;

    constructor(superDragSettingsService: SuperDragSettingsService) {
        this.superDragSettingsService = superDragSettingsService;
        this.gestureTrailRenderer = new GestureTrail({
            color: 'rgba(0, 0, 255, 0.5)',
            width: 3,
            zIndex: 999999
        });
    }

    public onMouseDown(e: MouseEvent) {
        // スーパードラッグ用の要素選択判定
        const selection = window.getSelection();
        if (selection && selection.toString()) {
            this.dragType = 'text';
        } else if ((e.target as HTMLElement).tagName === 'A') {
            this.dragType = 'link';
        } else if ((e.target as HTMLElement).tagName === 'IMG') {
            this.dragType = 'image';
        } else {
            this.dragType = DragType.NONE;
        }
        if (!this.dragType) {
            return;
        }
        this.isDrag = true;
        this.dragStartPos = new Point(e.clientX, e.clientY);
        Logger.debug('スーパードラッグ開始', { type: this.dragType, x: e.clientX, y: e.clientY });
        this.gestureTrailRenderer.startDrawing(this.dragStartPos);
    }

    public onDragStart(e: DragEvent) {
        if (!this.isDrag || this.dragType === 'none' || this.dragStartPos.isNone()) return;
        Logger.debug('ドラッグ開始', { type: this.dragType, x: e.clientX, y: e.clientY });
    }

    public onDrag(e: DragEvent) {
        if (!this.isDrag || this.dragType === 'none' || this.dragStartPos.isNone()) return;
        this.gestureTrailRenderer.updateTrail(new Point(e.clientX, e.clientY));

        // アクション名をリアルタイム表示
        const currentPoint = new Point(e.clientX, e.clientY);
        const direction = this.dragStartPos.getDirection(currentPoint);
        if (direction && direction !== Direction.NONE) {
            this.superDragSettingsService.getSettings().then((settings) => {
                const actionConfig = settings?.[this.dragType]?.[direction] || { action: '', params: {} };
                const actionName: string = actionConfig.action;
                if (actionName) {
                    ActionNotification.show(actionName);
                } else {
                    ActionNotification.hide();
                }
            });
        } else {
            ActionNotification.hide();
        }
    }

    public async onDragEnd(e: DragEvent) {
        if (!this.isDrag || this.dragType === 'none' || this.dragStartPos.isNone()) return;
        const currentPoint = new Point(e.clientX, e.clientY);
        const direction = this.dragStartPos.getDirection(currentPoint);
        Logger.debug('ドラッグ終了', { type: this.dragType, direction });

        if (direction === Direction.NONE) {
            ActionNotification.hide();
            return;
        }

        try {
            // SuperDragSettingsからアクション名・paramsを取得
            const settings = await this.superDragSettingsService.getSettings();
            const actionConfig = settings?.[this.dragType]?.[direction] || { action: '', params: {} };
            const actionName = actionConfig.action;
            const params = actionConfig.params;
            const action = SuperDragActionFactory.create(actionName as SuperDragActionType, new (require('../provider/content_container_provider').ContentContainerProvider)().getContainer());
            // selectedValueの取得
            let selectedValue = '';
            if (this.dragType === 'text') {
                selectedValue = window.getSelection()?.toString() || '';
            } else if (this.dragType === 'link') {
                selectedValue = (e.target as HTMLAnchorElement).href || '';
            } else if (this.dragType === 'image') {
                selectedValue = (e.target as HTMLImageElement).src || '';
            }
            action.execute({
                type: this.dragType,
                direction,
                actionName,
                params,
                selectedValue
            });
            // アクション通知UIを非表示
            ActionNotification.hide();
        } catch (err) {
            Logger.warn('未対応のスーパードラッグアクション', { type: this.dragType, direction });
            ActionNotification.hide();
        }

        this.isDrag = false;
        this.dragType = DragType.NONE;
        this.dragStartPos = Point.NONE;
        this.gestureTrailRenderer.clearTrail();
    }

    public isActive(): boolean {
        return this.isDrag;
    }

    public destroy(): void {
        this.gestureTrailRenderer.destroy();
        ActionNotification.destroy();
        Logger.debug('SuperDragHandler インスタンス破棄');
    }
} 