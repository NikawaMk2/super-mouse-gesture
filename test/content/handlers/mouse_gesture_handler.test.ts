import { MouseGestureHandler } from '../../../src/content/handlers/mouse_gesture_handler';
import { MouseGestureSettingsService } from '../../../src/content/services/gesture_action/settings/mouse_gesture_settings_service';
import { GestureActionType } from '../../../src/content/services/gesture_action/gesture_action_type';
import { Direction } from '../../../src/content/models/direction';
import { DEFAULT_MOUSE_GESTURE_SETTINGS } from '../../../src/common/constants/mouse_gesture_settings';

// LoggerとActionNotificationをモック
jest.mock('../../../src/common/logger/logger', () => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));
jest.mock('../../../src/content/handlers/action_notification', () => ({
    ActionNotification: {
        show: jest.fn(),
        hide: jest.fn(),
        destroy: jest.fn(),
    }
}));

import Logger from '../../../src/common/logger/logger';
import { ActionNotification } from '../../../src/content/handlers/action_notification';

const createServiceMock = (settings: any) => {
    return {
        getSettings: jest.fn().mockResolvedValue(settings),
    } as unknown as MouseGestureSettingsService;
};

describe('MouseGestureHandler', () => {
    it('設定値に一致するパターンならアクション名を返す', async () => {
        const settings = { 'right,down': 'closeTab' };
        const service = createServiceMock(settings);
        const handler = new MouseGestureHandler(service);
        const result = await handler.analyzeGesturePattern(['right', 'down'] as Direction[]);
        expect(result).toBe('closeTab');
    });

    it('設定値に一致しないパターンはGestureActionType.NONEを返す', async () => {
        const settings = { 'right,down': 'closeTab' };
        const service = createServiceMock(settings);
        const handler = new MouseGestureHandler(service);
        const result = await handler.analyzeGesturePattern(['left', 'up'] as Direction[]);
        expect(result).toBe(GestureActionType.NONE);
    });

    it('設定値がGestureActionType以外の場合はGestureActionType.NONEを返す', async () => {
        const settings = { 'right,down': 'notExistAction' };
        const service = createServiceMock(settings);
        const handler = new MouseGestureHandler(service);
        const result = await handler.analyzeGesturePattern(['right', 'down'] as Direction[]);
        expect(result).toBe(GestureActionType.NONE);
    });

    it('デフォルト値の全パターンで正しいアクション名を返す', async () => {
        const service = createServiceMock(undefined); // undefinedでデフォルト値を使わせる
        const handler = new MouseGestureHandler(service);
        for (const [pattern, action] of Object.entries(DEFAULT_MOUSE_GESTURE_SETTINGS)) {
            const directions = pattern.split(',') as Direction[];
            const result = await handler.analyzeGesturePattern(directions);
            expect(result).toBe(action);
        }
    });

    it('同じ方向が連続した場合、directionTrailには1回しか追加されない', () => {
        const service = createServiceMock({});
        const handler = new MouseGestureHandler(service);
        // GestureTrailのdocument依存を回避
        (handler as any).gestureTrailRenderer = { startDrawing: () => {}, updateTrail: () => {}, clearTrail: () => {}, destroy: () => {} };
        handler.onMouseDown({ clientX: 0, clientY: 0 } as MouseEvent);
        // 右→右→右（十分な距離で）
        handler.onMouseMove({ clientX: 50, clientY: 0 } as MouseEvent); // right
        handler.onMouseMove({ clientX: 100, clientY: 0 } as MouseEvent); // right
        handler.onMouseMove({ clientX: 150, clientY: 0 } as MouseEvent); // right
        expect(handler['directionTrail']).toEqual([Direction.RIGHT]);
    });

    it('NONEが含まれる場合、directionTrailには追加されない', () => {
        const service = createServiceMock({});
        const handler = new MouseGestureHandler(service);
        (handler as any).gestureTrailRenderer = { startDrawing: () => {}, updateTrail: () => {}, clearTrail: () => {}, destroy: () => {} };
        handler.onMouseDown({ clientX: 0, clientY: 0 } as MouseEvent);
        // ほぼ動かさない（NONE）
        handler.onMouseMove({ clientX: 0, clientY: 0 } as MouseEvent); // NONE
        handler.onMouseMove({ clientX: 1, clientY: 1 } as MouseEvent); // NONE（閾値未満）
        expect(handler['directionTrail']).toEqual([]);
    });

    it('異なる方向が続いた場合、すべてdirectionTrailに追加される', () => {
        const service = createServiceMock({});
        const handler = new MouseGestureHandler(service);
        (handler as any).gestureTrailRenderer = { startDrawing: () => {}, updateTrail: () => {}, clearTrail: () => {}, destroy: () => {} };
        handler.onMouseDown({ clientX: 0, clientY: 0 } as MouseEvent);
        handler.onMouseMove({ clientX: 50, clientY: 0 } as MouseEvent); // right
        handler.onMouseMove({ clientX: 50, clientY: 50 } as MouseEvent); // down
        handler.onMouseMove({ clientX: 0, clientY: 50 } as MouseEvent); // left
        handler.onMouseMove({ clientX: 0, clientY: 0 } as MouseEvent); // up
        expect(handler['directionTrail']).toEqual([
            Direction.RIGHT,
            Direction.DOWN,
            Direction.LEFT,
            Direction.UP
        ]);
    });

    describe('onMouseUp', () => {
        let handler: MouseGestureHandler;
        let service: MouseGestureSettingsService;
        let gestureTrailRendererMock: any;
        let gestureActionExecuteMock: jest.Mock;
        let gestureActionFactoryCreateSpy: jest.SpyInstance;

        beforeEach(() => {
            service = createServiceMock({ 'right': GestureActionType.GO_BACK });
            handler = new MouseGestureHandler(service);
            gestureTrailRendererMock = { clearTrail: jest.fn() };
            (handler as any).gestureTrailRenderer = gestureTrailRendererMock;
            gestureActionExecuteMock = jest.fn();
            // GestureActionFactory.createを直接spyOn
            const { GestureActionFactory } = require('../../../src/content/services/gesture_action/gesture_action_factory');
            gestureActionFactoryCreateSpy = jest.spyOn(GestureActionFactory, 'create').mockReturnValue({ execute: gestureActionExecuteMock });
            // directionTrailを直接セット
            (handler as any).directionTrail = [Direction.RIGHT];
            (handler as any).isGesture = true;
        });

        afterEach(() => {
            jest.clearAllMocks();
            gestureActionFactoryCreateSpy.mockRestore();
        });

        it('アクションが実行される場合、executeとLogger.debug/ActionNotification.hideが呼ばれる', async () => {
            await handler.onMouseUp({} as MouseEvent);
            expect(gestureTrailRendererMock.clearTrail).toHaveBeenCalled();
            expect(gestureActionExecuteMock).toHaveBeenCalled();
            expect(ActionNotification.hide).toHaveBeenCalled();
            expect(Logger.debug).toHaveBeenCalledWith('ジェスチャパターン認識', { pattern: GestureActionType.GO_BACK });
        });

        it('未対応パターンの場合、Logger.warn/ActionNotification.hideが呼ばれる', async () => {
            // GestureActionFactory.createが例外を投げるようにする
            gestureActionFactoryCreateSpy.mockImplementation(() => { throw new Error('未対応'); });
            await handler.onMouseUp({} as MouseEvent);
            expect(ActionNotification.hide).toHaveBeenCalled();
            expect(Logger.warn).toHaveBeenCalledWith('未対応のジェスチャパターン', { pattern: GestureActionType.GO_BACK });
        });

        it('NONEパターンの場合、ActionNotification.hideのみ呼ばれる', async () => {
            (handler as any).directionTrail = [];
            await handler.onMouseUp({} as MouseEvent);
            expect(ActionNotification.hide).toHaveBeenCalled();
        });
    });
}); 