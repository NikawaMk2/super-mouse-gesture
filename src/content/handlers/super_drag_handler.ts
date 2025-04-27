import Logger from '../../common/logger/logger';
import { SuperDragActionFactory } from '../services/super_drag_action/super_drag_action_factory';
import { SuperDragActionType } from '../services/super_drag_action/super_drag_action_type';
import { Point } from '../models/point';
import { Direction } from '../models/direction';
import { DragType } from '../models/drag_type';
import { SuperDragSettingsService } from '../services/super_drag_action/settings/super_drag_settings_service';

export class SuperDragHandler {
    private isDrag: boolean = false;
    private dragStartPos: Point = Point.NONE;
    private dragType: DragType = DragType.NONE;
    private superDragSettingsService: SuperDragSettingsService;

    constructor(superDragSettingsService: SuperDragSettingsService) {
        this.superDragSettingsService = superDragSettingsService;
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
    }

    public onDragStart(e: DragEvent) {
        if (!this.isDrag || this.dragType === 'none' || this.dragStartPos.isNone()) return;
        Logger.debug('ドラッグ開始', { type: this.dragType, x: e.clientX, y: e.clientY });
    }

    public onDrag(e: DragEvent) {
        // ドラッグ方向検知・UI表示は今後実装
        // TODO: ドラッグ方向UI表示（UI表示クラス呼び出し）
    }

    public async onDragEnd(e: DragEvent) {
        if (!this.isDrag || this.dragType === 'none' || this.dragStartPos.isNone()) return;
        const currentPoint = new Point(e.clientX, e.clientY);
        const direction = this.dragStartPos.getDirection(currentPoint);
        Logger.info('ドラッグ終了', { type: this.dragType, direction });

        if (direction === Direction.NONE) {
            return;
        }

        try {
            const actionName = await this.getSuperDragActionName(this.dragType, direction);
            const action = SuperDragActionFactory.create(actionName as SuperDragActionType);
            action.execute({
                type: this.dragType,
                direction,
                actionName,
                params: {}
            });
            // TODO: スーパードラッグアクション通知表示（UI表示クラス呼び出し）
        } catch (err) {
            Logger.warn('未対応のスーパードラッグアクション', { type: this.dragType, direction });
        }

        this.isDrag = false;
        this.dragType = DragType.NONE;
        this.dragStartPos = Point.NONE;
    }

    public isActive(): boolean {
        return this.isDrag;
    }

    // 設定に応じてスーパードラッグアクション名を決定
    private async getSuperDragActionName(type: DragType, direction: Direction): Promise<string> {
        const settings = await this.superDragSettingsService.getSettings();
        return settings?.[type]?.[direction] || 'searchGoogle';
    }
} 