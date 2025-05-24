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
    private TAGNAME_A = 'A';
    private TAGNAME_IMG = 'IMG';

    private isDrag: boolean = false;
    private dragStartPos: Point = Point.NONE;
    private dragType: DragType = DragType.NONE;
    private superDragSettingsService: SuperDragSettingsService;

    constructor(superDragSettingsService: SuperDragSettingsService) {
        this.superDragSettingsService = superDragSettingsService;
    }

    public onMouseDown(e: MouseEvent) {
        // スーパードラッグ用の要素選択判定
        this.dragType = this.getDragType(e);
        if (this.dragType === DragType.NONE) {
            return;
        }

        this.isDrag = true;
        this.dragStartPos = new Point(e.clientX, e.clientY);
        Logger.debug('スーパードラッグ開始', { type: this.dragType, x: e.clientX, y: e.clientY });
    }

    public onDragStart(e: DragEvent) {
        if (!this.isDrag || this.dragType === DragType.NONE || this.dragStartPos.isNone()) return;
        Logger.debug('ドラッグ開始', { type: this.dragType, x: e.clientX, y: e.clientY });
    }

    public onDrag(e: DragEvent) {
        if (!this.isDrag || this.dragType === DragType.NONE || this.dragStartPos.isNone()) return;

        // アクション名をリアルタイム表示
        const currentPoint = new Point(e.clientX, e.clientY);
        const direction = this.dragStartPos.getDirection(currentPoint);
        
        if (!direction || direction === Direction.NONE) {
            ActionNotification.hide();
            return;
        }

        this.superDragSettingsService.getSettings().then((settings) => {
            const actionConfig = settings?.[this.dragType]?.[direction] || { action: '', params: {} };
            const actionName: string = actionConfig.action;
            
            if (!actionName) {
                ActionNotification.hide();
                return;
            }
            
            ActionNotification.show(actionName);
        });
    }

    public async onDragEnd(e: DragEvent) {
        if (!this.isDrag || this.dragType === DragType.NONE || this.dragStartPos.isNone()) return;
        const currentPoint = new Point(e.clientX, e.clientY);
        const direction = this.dragStartPos.getDirection(currentPoint);
        Logger.debug('ドラッグ終了', { type: this.dragType, direction });

        try {

            if (direction === Direction.NONE) {
                return;
            }

            // SuperDragSettingsからアクション名・paramsを取得
            const settings = await this.superDragSettingsService.getSettings();
            const actionConfig = settings?.[this.dragType]?.[direction] || { action: '', params: {} };
            const actionName = actionConfig.action;
            const params = actionConfig.params;
            const action = SuperDragActionFactory.create(actionName as SuperDragActionType, new (require('../provider/content_container_provider').ContentContainerProvider)().getContainer());
            // selectedValueの取得
            let selectedValue = '';
            if (this.dragType === DragType.TEXT) {
                selectedValue = window.getSelection()?.toString() || '';
            } else if (this.dragType === DragType.LINK) {
                selectedValue = (e.target as HTMLAnchorElement).href || '';
            } else if (this.dragType === DragType.IMAGE) {
                selectedValue = (e.target as HTMLImageElement).src || '';
            }
            action.execute({
                type: this.dragType,
                direction,
                actionName,
                params,
                selectedValue
            });
        } catch (err) {
            Logger.warn('未対応のスーパードラッグアクション', { type: this.dragType, direction });
        } finally {
            ActionNotification.hide();
            this.isDrag = false;
            this.dragType = DragType.NONE;
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

    private getDragType(e: MouseEvent): DragType {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
            return DragType.TEXT;
        } else if ((e.target as HTMLElement).tagName === this.TAGNAME_A) {
            return DragType.LINK;
        } else if ((e.target as HTMLElement).tagName === this.TAGNAME_IMG) {
            return DragType.IMAGE;
        } else {
            return DragType.NONE;
        }
    }
} 