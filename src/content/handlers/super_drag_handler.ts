import Logger from '../../common/logger/logger';
import { SuperDragActionFactory } from '../services/super_drag_action/super_drag_action_factory';
import { SuperDragActionType } from '../services/super_drag_action/super_drag_action_type';
import { Point } from '../models/point';
import { Direction } from '../models/direction';
import { DragType } from '../models/drag_type';
import { SuperDragSettingsService } from '../services/super_drag_action/settings/super_drag_settings_service';
import { ActionNotification } from './action_notification';
import { ContentContainerProvider } from '../provider/content_container_provider';
import { DragContext } from './drag_context';

export class SuperDragHandler {
    private isDrag: boolean = false;
    private dragStartPos: Point = Point.NONE;
    private dragContext: DragContext = DragContext.default();
    private superDragSettingsService: SuperDragSettingsService;

    constructor(superDragSettingsService: SuperDragSettingsService) {
        this.superDragSettingsService = superDragSettingsService;
    }

    public onMouseDown(e: MouseEvent) {
        // スーパードラッグ用の要素選択判定
        this.dragContext = DragContext.create(e);
        if (this.dragContext.dragType === DragType.NONE) {
            return;
        }

        this.isDrag = true;
        this.dragStartPos = new Point(e.clientX, e.clientY);
        Logger.debug('スーパードラッグ開始', { type: this.dragContext.dragType, x: e.clientX, y: e.clientY });
    }

    public onDragStart(e: DragEvent) {
        if (!this.isDrag || this.dragContext.dragType === DragType.NONE || this.dragStartPos.isNone()) return;
        Logger.debug('ドラッグ開始', { type: this.dragContext.dragType, x: e.clientX, y: e.clientY });
    }

    public onDrag(e: DragEvent) {
        if (!this.isDrag || this.dragContext.dragType === DragType.NONE || this.dragStartPos.isNone()) return;

        // アクション名をリアルタイム表示
        const currentPoint = new Point(e.clientX, e.clientY);
        const direction = this.dragStartPos.getDirection(currentPoint);
        
        if (!direction || direction === Direction.NONE) {
            ActionNotification.hide();
            return;
        }

        this.superDragSettingsService.getSettings().then((settings) => {
            const actionConfig = settings?.[this.dragContext.dragType]?.[direction] || { action: '', params: {} };
            const actionName: string = actionConfig.action;
            
            if (!actionName) {
                ActionNotification.hide();
                return;
            }
            
            ActionNotification.show(actionName);
        });
    }

    public async onDragEnd(e: DragEvent) {
        if (!this.isDrag || this.dragContext.dragType === DragType.NONE || this.dragStartPos.isNone()) return;
        const currentPoint = new Point(e.clientX, e.clientY);
        const direction = this.dragStartPos.getDirection(currentPoint);
        Logger.debug('ドラッグ終了', { type: this.dragContext.dragType, direction });

        try {

            if (direction === Direction.NONE) {
                return;
            }

            // SuperDragSettingsからアクション名・paramsを取得
            const settings = await this.superDragSettingsService.getSettings();
            const actionConfig = settings?.[this.dragContext.dragType]?.[direction] || { action: '', params: {} };
            const actionName = actionConfig.action;
            const params = actionConfig.params;
            const action = SuperDragActionFactory.create(actionName as SuperDragActionType, new ContentContainerProvider().getContainer());

            const selectedValue = this.dragContext.selectedValue;
            action.execute({
                type: this.dragContext.dragType,
                direction,
                actionName,
                params,
                selectedValue
            });
        } catch (err) {
            Logger.warn('未対応のスーパードラッグアクション', { type: this.dragContext.dragType, direction });
        } finally {
            ActionNotification.hide();
            this.isDrag = false;
            this.dragContext = DragContext.default();
            this.dragStartPos = Point.NONE;
        }
    }

    public isActive(): boolean {
        return this.isDrag;
    }

    public destroy(): void {
        ActionNotification.destroy();
        Logger.debug('SuperDragHandler インスタンス破棄');
    }
} 