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
    private dragStartPos: Point = Point.NONE;
    private dragContext: DragContext = DragContext.default();
    private superDragSettingsService: SuperDragSettingsService;
    private directionHistory: Set<Direction> = new Set(); // 移動方向の履歴
    private isActionDisabled: boolean = false; // アクションが無効化されているかどうか

    constructor(superDragSettingsService: SuperDragSettingsService) {
        this.superDragSettingsService = superDragSettingsService;
    }

    public onMouseDown(e: MouseEvent) {
        // スーパードラッグ用の要素選択判定
        this.dragContext = DragContext.create(e);
        if (this.dragContext.dragType === DragType.NONE) {
            return;
        }

        this.dragStartPos = new Point(e.clientX, e.clientY);
        // 方向履歴と無効化フラグをリセット
        this.directionHistory.clear();
        this.isActionDisabled = false;
        Logger.debug('スーパードラッグの要素を選択', { context: this.dragContext, x: e.clientX, y: e.clientY });
    }

    public onDragStart(e: DragEvent) {
        if (this.isNotDrag()) return;
        Logger.debug('ドラッグ開始', { context: this.dragContext, x: e.clientX, y: e.clientY });
    }

    public onDrag(e: DragEvent) {
        if (this.isNotDrag()) return;

        // アクション名をリアルタイム表示
        const currentPoint = new Point(e.clientX, e.clientY);
        const direction = this.dragStartPos.getDirection(currentPoint);
        
        if (!direction || direction === Direction.NONE) {
            ActionNotification.hide();
            return;
        }

        // 方向追跡：新しい方向が検出された場合に履歴に追加
        if (!this.directionHistory.has(direction)) {
            this.directionHistory.add(direction);
            
            // 2方向目の移動を検出した場合、アクションを無効化
            if (this.directionHistory.size >= 2 && !this.isActionDisabled) {
                this.isActionDisabled = true;
                Logger.debug('2方向目の移動を検出', { 
                    directions: Array.from(this.directionHistory),
                    currentDirection: direction 
                });
                return;
            }
        }

        // アクションが無効化されている場合は、無効化メッセージを継続表示
        if (this.isActionDisabled) {
            ActionNotification.showSuperDragActionHandler(SuperDragActionType.NONE);
            return;
        }

        this.superDragSettingsService.getSettings().then((settings) => {
            const actionConfig = settings?.[this.dragContext.dragType]?.[direction] || { action: '', params: {} };
            const actionName: string = actionConfig.action;
            
            if (!actionName) {
                ActionNotification.hide();
                return;
            }
            
            ActionNotification.showSuperDragActionHandler(actionName as SuperDragActionType);
        });
    }

    public async onDragEnd(e: DragEvent) {
        if (this.isNotDrag()) return;
        const currentPoint = new Point(e.clientX, e.clientY);
        const direction = this.dragStartPos.getDirection(currentPoint);
        Logger.debug('ドラッグ終了', { 
            context: this.dragContext, 
            direction,
            directionHistory: Array.from(this.directionHistory),
            isActionDisabled: this.isActionDisabled
        });

        try {

            if (direction === Direction.NONE) {
                return;
            }

            // アクションが無効化されている場合は実行しない
            if (this.isActionDisabled) {
                Logger.debug('アクションが無効化されているため実行をスキップ', { 
                    direction,
                    directionHistory: Array.from(this.directionHistory)
                });
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
            Logger.warn('未対応のスーパードラッグアクション', { context: this.dragContext, direction });
        } finally {
            ActionNotification.hide();
            this.dragContext = DragContext.default();
            this.dragStartPos = Point.NONE;
            // 方向履歴と無効化フラグをリセット
            this.directionHistory.clear();
            this.isActionDisabled = false;
        }
    }

    public destroy(): void {
        ActionNotification.destroy();
        Logger.debug('SuperDragHandler インスタンス破棄');
    }

    private isNotDrag(): boolean {
        return this.dragContext.dragType === DragType.NONE;
    }
} 