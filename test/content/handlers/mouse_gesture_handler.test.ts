/**
 * @jest-environment jsdom
 */
import { MouseGestureHandler } from '../../../src/content/handlers/mouse_gesture_handler';
import { MouseGestureSettingsService } from '../../../src/content/services/gesture_action/settings/mouse_gesture_settings_service';
import { GestureActionType } from '../../../src/content/services/gesture_action/gesture_action_type';
import { Direction } from '../../../src/content/models/direction';
import { DirectionTrail } from '../../../src/content/models/direction_trail';
import { Point } from '../../../src/content/models/point';
import { DEFAULT_MOUSE_GESTURE_SETTINGS } from '../../../src/common/constants/mouse_gesture_settings';
import Logger from '../../../src/common/logger/logger';

// モック設定
jest.mock('../../../src/common/logger/logger');
jest.mock('../../../src/content/handlers/gesture_trail');
jest.mock('../../../src/content/handlers/action_notification');
jest.mock('../../../src/content/services/gesture_action/gesture_action_factory');
jest.mock('../../../src/content/provider/content_container_provider');

// GestureTrailのモック
const mockGestureTrail = {
    startDrawing: jest.fn(),
    updateTrail: jest.fn(),
    clearTrail: jest.fn(),
    destroy: jest.fn(),
};

// ActionNotificationのモック
const mockActionNotification = {
    showMouseGestureHandler: jest.fn(),
    hide: jest.fn(),
    destroy: jest.fn(),
};

// GestureActionFactoryのモック
const mockGestureActionFactory = {
    create: jest.fn(),
};

// ContentContainerProviderのモック
const mockContentContainerProvider = {
    getContainer: jest.fn(),
};

// モジュールのモック設定
const { GestureTrail } = require('../../../src/content/handlers/gesture_trail');
const { ActionNotification } = require('../../../src/content/handlers/action_notification');
const { GestureActionFactory } = require('../../../src/content/services/gesture_action/gesture_action_factory');

// GestureTrailクラスのモック
(GestureTrail as jest.Mock).mockImplementation(() => mockGestureTrail);

// ActionNotificationの静的メソッドをモック
Object.assign(ActionNotification, mockActionNotification);

// GestureActionFactoryの静的メソッドをモック
Object.assign(GestureActionFactory, mockGestureActionFactory);

describe('MouseGestureHandler クラスのテスト', () => {
    let handler: MouseGestureHandler;
    let mockSettingsService: jest.Mocked<MouseGestureSettingsService>;
    let mockMouseEvent: MouseEvent;

    beforeEach(() => {
        jest.clearAllMocks();

        // MouseGestureSettingsServiceのモック
        mockSettingsService = {
            getSettings: jest.fn(),
        } as any;

        // MouseEventのモック
        mockMouseEvent = {
            clientX: 100,
            clientY: 200,
            preventDefault: jest.fn(),
        } as any;

        // デフォルト設定を返すように設定
        mockSettingsService.getSettings.mockResolvedValue(DEFAULT_MOUSE_GESTURE_SETTINGS);

        handler = new MouseGestureHandler(mockSettingsService);
    });

    afterEach(() => {
        handler.destroy();
    });

    describe('コンストラクタの契約', () => {
        test('事前条件: MouseGestureSettingsServiceが渡されること', () => {
            // 実際のコードではnullチェックをしていないが、依存関係として必要
            const handlerWithNull = new MouseGestureHandler(null as any);
            expect(handlerWithNull['mouseGestureSettingsService']).toBeNull();
            handlerWithNull.destroy();
        });

        test('事後条件: 初期状態が正しく設定されること', () => {
            const newHandler = new MouseGestureHandler(mockSettingsService);
            
            // 不変条件: 初期状態の検証
            expect(newHandler.isActive()).toBe(false);
            expect(newHandler['isGesture']).toBe(false);
            expect(newHandler['wasGestureRecognized']).toBe(false);
            expect(newHandler['gestureTrail']).toEqual([]);
            expect(newHandler['directionTrail']).toBeInstanceOf(DirectionTrail);
            expect(newHandler['mouseGestureSettingsService']).toBe(mockSettingsService);
            expect(newHandler['gestureTrailRenderer']).toBeDefined();
            
            newHandler.destroy();
        });
    });

    describe('onMouseDown メソッドの契約', () => {
        test('事前条件: MouseEventのプロパティが参照されること', () => {
            // clientX, clientYプロパティが必要（undefinedでも動作するが、NaNになる）
            const eventWithoutCoords = {} as MouseEvent;
            expect(() => handler.onMouseDown(eventWithoutCoords)).not.toThrow();
            
            // undefinedの座標でPointが作成される
            expect(handler['gestureTrail'][0]['x']).toBeUndefined();
            expect(handler['gestureTrail'][0]['y']).toBeUndefined();
        });

        test('事後条件: ジェスチャ状態が開始状態になること', () => {
            handler.onMouseDown(mockMouseEvent);

            // 事後条件の検証
            expect(handler.isActive()).toBe(true);
            expect(handler['isGesture']).toBe(true);
            expect(handler['wasGestureRecognized']).toBe(false);
            expect(handler['gestureTrail']).toHaveLength(1);
            expect(handler['gestureTrail'][0]).toBeInstanceOf(Point);
            expect(handler['gestureTrail'][0]['x']).toBe(100);
            expect(handler['gestureTrail'][0]['y']).toBe(200);
            
            // DirectionTrailがリセットされていることを確認
            expect(handler['directionTrail'].isEmpty()).toBe(true);
        });

        test('不変条件: 複数回呼び出しても状態が一貫していること', () => {
            handler.onMouseDown(mockMouseEvent);
            
            // 2回目の呼び出し
            const secondEvent = { ...mockMouseEvent, clientX: 150, clientY: 250 } as MouseEvent;
            handler.onMouseDown(secondEvent);
            
            // 不変条件: ジェスチャ状態は維持される
            expect(handler.isActive()).toBe(true);
            expect(handler['gestureTrail']).toHaveLength(1); // 新しい開始点で初期化される
            expect(handler['gestureTrail'][0]['x']).toBe(150);
            expect(handler['gestureTrail'][0]['y']).toBe(250);
        });
    });

    describe('onMouseMove メソッドの契約', () => {
        test('事前条件: ジェスチャが開始されていない場合は何もしないこと', () => {
            handler.onMouseMove(mockMouseEvent);
            
            // 事前条件違反時の動作確認
            expect(handler['gestureTrail']).toHaveLength(0);
        });

        test('事前条件: MouseEventのプロパティが参照されること', () => {
            handler.onMouseDown(mockMouseEvent);
            const eventWithoutCoords = {} as MouseEvent;
            expect(() => handler.onMouseMove(eventWithoutCoords)).not.toThrow();
            
            // undefinedの座標でもPointが作成される
            expect(handler['gestureTrail']).toHaveLength(2);
            expect(handler['gestureTrail'][1]['x']).toBeUndefined();
            expect(handler['gestureTrail'][1]['y']).toBeUndefined();
        });

        test('事後条件: ジェスチャトレイルが更新されること', () => {
            handler.onMouseDown(mockMouseEvent);
            
            const moveEvent = { ...mockMouseEvent, clientX: 150, clientY: 250 } as MouseEvent;
            handler.onMouseMove(moveEvent);
            
            // 事後条件の検証
            expect(handler['gestureTrail']).toHaveLength(2);
            expect(handler['gestureTrail'][1]['x']).toBe(150);
            expect(handler['gestureTrail'][1]['y']).toBe(250);
        });

        test('不変条件: ジェスチャ状態が維持されること', () => {
            handler.onMouseDown(mockMouseEvent);
            const initialActive = handler.isActive();
            
            const moveEvent = { ...mockMouseEvent, clientX: 150, clientY: 250 } as MouseEvent;
            handler.onMouseMove(moveEvent);
            
            // 不変条件: ジェスチャ状態は変わらない
            expect(handler.isActive()).toBe(initialActive);
            expect(handler['isGesture']).toBe(true);
        });
    });

    describe('onMouseUp メソッドの契約', () => {
        test('事前条件: ジェスチャが開始されていない場合は何もしないこと', async () => {
            await handler.onMouseUp(mockMouseEvent);
            
            // 事前条件違反時の動作確認（内部状態は変わらない）
            expect(handler.isActive()).toBe(false);
        });

        test('事後条件: ジェスチャ状態が終了状態になること', async () => {
            handler.onMouseDown(mockMouseEvent);
            await handler.onMouseUp(mockMouseEvent);
            
            // 事後条件の検証
            expect(handler.isActive()).toBe(false);
            expect(handler['isGesture']).toBe(false);
            expect(handler['gestureTrail']).toEqual([]);
            expect(handler['directionTrail'].isEmpty()).toBe(true);
        });

        test('不変条件: 無効なパターンの場合はアクションが実行されないこと', async () => {
            handler.onMouseDown(mockMouseEvent);
            // 短すぎる移動（方向が認識されない）
            const shortMoveEvent = { ...mockMouseEvent, clientX: 105, clientY: 205 } as MouseEvent;
            handler.onMouseMove(shortMoveEvent);
            
            await handler.onMouseUp(shortMoveEvent);
            
            // 状態は正常に終了する
            expect(handler.isActive()).toBe(false);
        });
    });

    describe('onContextMenu メソッドの契約', () => {
        test('事前条件: MouseEventのpreventDefaultメソッドが必要', () => {
            const eventWithoutPreventDefault = {} as MouseEvent;
            handler['wasGestureRecognized'] = true;
            expect(() => handler.onContextMenu(eventWithoutPreventDefault)).toThrow();
        });

        test('事後条件: ジェスチャが認識されていない場合は何もしないこと', () => {
            handler.onContextMenu(mockMouseEvent);
            
            // 事後条件の検証
            expect(mockMouseEvent.preventDefault).not.toHaveBeenCalled();
        });

        test('事後条件: ジェスチャが認識されている場合はデフォルト動作を防ぐこと', () => {
            // wasGestureRecognizedを直接trueに設定
            handler['wasGestureRecognized'] = true;
            
            handler.onContextMenu(mockMouseEvent);
            
            // 事後条件の検証
            expect(mockMouseEvent.preventDefault).toHaveBeenCalled();
        });
    });

    describe('isActive メソッドの契約', () => {
        test('事後条件: ジェスチャ状態を正確に返すこと', async () => {
            // 初期状態
            expect(handler.isActive()).toBe(false);
            
            // ジェスチャ開始後
            handler.onMouseDown(mockMouseEvent);
            expect(handler.isActive()).toBe(true);
            
            // ジェスチャ終了後
            await handler.onMouseUp(mockMouseEvent);
            expect(handler.isActive()).toBe(false);
        });

        test('不変条件: 内部状態を変更しないこと', () => {
            const initialGesture = handler['isGesture'];
            const initialTrailLength = handler['gestureTrail'].length;
            
            handler.isActive();
            
            // 不変条件の検証
            expect(handler['isGesture']).toBe(initialGesture);
            expect(handler['gestureTrail']).toHaveLength(initialTrailLength);
        });
    });

    describe('destroy メソッドの契約', () => {
        test('事後条件: リソースが適切にクリーンアップされること', () => {
            handler.destroy();
            
            // 事後条件の検証（ログが出力される）
            expect(Logger.debug).toHaveBeenCalledWith('MouseGestureHandler インスタンス破棄');
        });

        test('不変条件: 複数回呼び出しても安全であること', () => {
            handler.destroy();
            
            // 2回目の呼び出し
            expect(() => handler.destroy()).not.toThrow();
        });
    });

    describe('analyzeGesturePattern メソッドの契約', () => {
        test('事前条件: DirectionTrailのメソッドが呼び出されること', async () => {
            const invalidTrail = {} as DirectionTrail;
            await expect(handler.analyzeGesturePattern(invalidTrail)).rejects.toThrow();
        });

        test('事後条件: 空のトレイルの場合はNONEを返すこと', async () => {
            const emptyTrail = new DirectionTrail();
            const result = await handler.analyzeGesturePattern(emptyTrail);
            
            expect(result).toBe(GestureActionType.NONE);
        });

        test('事後条件: 設定に存在するパターンの場合は対応するアクションを返すこと', async () => {
            const trail = new DirectionTrail();
            trail.add(Direction.LEFT);
            
            const result = await handler.analyzeGesturePattern(trail);
            
            expect(result).toBe(GestureActionType.GO_BACK);
        });

        test('事後条件: 設定に存在しないパターンの場合はNONEを返すこと', async () => {
            const trail = new DirectionTrail();
            trail.add(Direction.LEFT);
            trail.add(Direction.UP);
            trail.add(Direction.RIGHT);
            trail.add(Direction.DOWN); // 存在しないパターン
            
            const result = await handler.analyzeGesturePattern(trail);
            
            expect(result).toBe(GestureActionType.NONE);
        });

        test('事後条件: 設定取得失敗時はデフォルト設定を使用すること', async () => {
            mockSettingsService.getSettings.mockResolvedValue(null as any);
            
            const trail = new DirectionTrail();
            trail.add(Direction.LEFT);
            
            const result = await handler.analyzeGesturePattern(trail);
            
            expect(result).toBe(DEFAULT_MOUSE_GESTURE_SETTINGS['left']);
            expect(Logger.warn).toHaveBeenCalledWith(
                '設定値が取得できませんでした。デフォルト設定を使用します。',
                { pattern: 'left' }
            );
        });

        test('不変条件: DirectionTrailの状態を変更しないこと', async () => {
            const trail = new DirectionTrail();
            trail.add(Direction.LEFT);
            const initialPattern = trail.toPattern();
            const initialLength = trail.getLength();
            
            await handler.analyzeGesturePattern(trail);
            
            // 不変条件の検証
            expect(trail.toPattern()).toBe(initialPattern);
            expect(trail.getLength()).toBe(initialLength);
        });

        test('例外処理: 設定サービスが例外を投げた場合', async () => {
            mockSettingsService.getSettings.mockRejectedValue(new Error('Settings error'));
            
            const trail = new DirectionTrail();
            trail.add(Direction.LEFT);
            
            // 例外が発生した場合はそのまま投げられる
            await expect(handler.analyzeGesturePattern(trail)).rejects.toThrow('Settings error');
        });
    });

    describe('全体的な不変条件', () => {
        test('ジェスチャ状態の一貫性が保たれること', async () => {
            // 初期状態
            expect(handler.isActive()).toBe(false);
            expect(handler['gestureTrail']).toHaveLength(0);
            
            // ジェスチャ開始
            handler.onMouseDown(mockMouseEvent);
            expect(handler.isActive()).toBe(true);
            expect(handler['gestureTrail']).toHaveLength(1);
            
            // ジェスチャ移動
            const moveEvent = { ...mockMouseEvent, clientX: 150, clientY: 250 } as MouseEvent;
            handler.onMouseMove(moveEvent);
            expect(handler.isActive()).toBe(true);
            expect(handler['gestureTrail'].length).toBeGreaterThan(1);
            
            // ジェスチャ終了
            await handler.onMouseUp(moveEvent);
            expect(handler.isActive()).toBe(false);
            expect(handler['gestureTrail']).toHaveLength(0);
        });

        test('設定サービスの依存関係が維持されること', async () => {
            expect(handler['mouseGestureSettingsService']).toBe(mockSettingsService);
            
            // 他のメソッド呼び出し後も依存関係が維持される
            handler.onMouseDown(mockMouseEvent);
            expect(handler['mouseGestureSettingsService']).toBe(mockSettingsService);
            
            await handler.onMouseUp(mockMouseEvent);
            expect(handler['mouseGestureSettingsService']).toBe(mockSettingsService);
        });
    });

    describe('境界値テスト', () => {
        test('座標が0の場合も正常に動作すること', () => {
            const zeroEvent = { ...mockMouseEvent, clientX: 0, clientY: 0 } as MouseEvent;
            
            expect(() => handler.onMouseDown(zeroEvent)).not.toThrow();
            expect(handler['gestureTrail'][0]['x']).toBe(0);
            expect(handler['gestureTrail'][0]['y']).toBe(0);
        });

        test('座標が負の値の場合も正常に動作すること', () => {
            const negativeEvent = { ...mockMouseEvent, clientX: -10, clientY: -20 } as MouseEvent;
            
            expect(() => handler.onMouseDown(negativeEvent)).not.toThrow();
            expect(handler['gestureTrail'][0]['x']).toBe(-10);
            expect(handler['gestureTrail'][0]['y']).toBe(-20);
        });

        test('座標が非常に大きい値の場合も正常に動作すること', () => {
            const largeEvent = { ...mockMouseEvent, clientX: 999999, clientY: 999999 } as MouseEvent;
            
            expect(() => handler.onMouseDown(largeEvent)).not.toThrow();
            expect(handler['gestureTrail'][0]['x']).toBe(999999);
            expect(handler['gestureTrail'][0]['y']).toBe(999999);
        });
    });

    describe('方向認識の契約', () => {
        test('十分な距離の移動で方向が認識されること', () => {
            handler.onMouseDown(mockMouseEvent);
            
            // 左方向への十分な移動
            const leftMoveEvent = { ...mockMouseEvent, clientX: 50, clientY: 200 } as MouseEvent;
            handler.onMouseMove(leftMoveEvent);
            
            // DirectionTrailに方向が追加されていることを確認
            expect(handler['directionTrail'].isEmpty()).toBe(false);
            expect(handler['directionTrail'].getLength()).toBe(1);
        });

        test('短い距離の移動では方向が認識されないこと', () => {
            handler.onMouseDown(mockMouseEvent);
            
            // 短い移動（閾値未満）
            const shortMoveEvent = { ...mockMouseEvent, clientX: 105, clientY: 205 } as MouseEvent;
            handler.onMouseMove(shortMoveEvent);
            
            // DirectionTrailに方向が追加されていないことを確認
            expect(handler['directionTrail'].isEmpty()).toBe(true);
        });
    });
});
