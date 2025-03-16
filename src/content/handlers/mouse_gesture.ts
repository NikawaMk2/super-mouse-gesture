import { GestureType } from '../../common/api/setting/gesture_setting/gesture_type';
import { ChromeGestureSettingsLoader } from '../../common/api/setting/gesture_setting/loader/chrome_gesture_settings_loader';
import { GestureSettingsLoader } from '../../common/api/setting/gesture_setting/loader/gesture_settings_loader';
import Logger from '../../common/utils/logger';
import GestureIndicator from '../components/gesture_indicaror';
import DirectionList from '../models/direcrion/direcrion_list';
import { GestureActionFactory } from './gesture_action/gesture_action_factory';
import Point from '../models/point/point';
import '../../common/utils/reflect_metadata';
import { MouseButton } from '../../common/const/mouse_button';

export default class MouseGesture {   
    private readonly settingsLoader: GestureSettingsLoader = new ChromeGestureSettingsLoader();
    private isDragging: boolean = false;
    private gestureStart: Point | null = null;
    private lastDirectionPoint: Point | null = null;
    private movementHistory: DirectionList = new DirectionList([]);

    private gestureIndicator: GestureIndicator = new GestureIndicator();

    constructor(private element: HTMLElement) {
        console.log('MouseGestureのコンストラクタ呼び出し');
        if (!this.element) {
            Logger.error('elementが設定されていません');
            return;
        }

        // キャプチャフェーズでイベントを捕捉
        this.element.addEventListener('mousedown', this.handleMouseDown, true);
        this.element.addEventListener('mousemove', this.handleMouseMove, true);
        this.element.addEventListener('mouseup', this.handleMouseUp, true);
        this.element.addEventListener('mouseleave', this.handleMouseUp, true);
        
        console.log('MouseGesture 初期化:', this.element);
    }

    public dispose() {
        // 既にクリーンアップ済みの場合は何もしない
        if (!this.element) {
            return;
        }

        Logger.debug('マウスジェスチャーのクリーンアップを開始');

        try {
            // イベントリスナーの削除
            this.element.removeEventListener('mousedown', this.handleMouseDown, true);
            this.element.removeEventListener('mousemove', this.handleMouseMove, true);
            this.element.removeEventListener('mouseup', this.handleMouseUp, true);
            this.element.removeEventListener('mouseleave', this.handleMouseUp, true);

            Logger.debug('マウスジェスチャーのクリーンアップが完了しました');
        } catch (error) {
            Logger.error(`クリーンアップ中にエラーが発生しました: ${error}`);
        }
    }
    
    private handleMouseDown = (event: MouseEvent) => {
        if (event.button !== MouseButton.Right) {
            return;
        }

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
        this.gestureIndicator.update(gestureType || '');
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
