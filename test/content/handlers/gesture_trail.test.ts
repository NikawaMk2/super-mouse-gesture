/**
 * @jest-environment jsdom
 */
import { GestureTrail, GestureTrailOptions } from '../../../src/content/handlers/gesture_trail';
import { Point } from '../../../src/content/models/point';
import Logger from '../../../src/common/logger/logger';

// Logger のモック
jest.mock('../../../src/common/logger/logger');

// Point のモック (必要に応じてメソッドを実装)
jest.mock('../../../src/content/models/point', () => {
    return {
        Point: jest.fn().mockImplementation((x, y) => ({
            getX: jest.fn().mockReturnValue(x),
            getY: jest.fn().mockReturnValue(y),
        })),
    };
});

// DOM API の基本的なモック
let mockContext: any;
let mockCanvas: any;

beforeAll(() => {
    // requestAnimationFrame/cancelAnimationFrameをグローバルにモック
    (globalThis as any)._originalRequestAnimationFrame = window.requestAnimationFrame;
    (globalThis as any)._originalCancelAnimationFrame = window.cancelAnimationFrame;
    window.requestAnimationFrame = jest.fn((cb) => { cb(0); return 1; });
    window.cancelAnimationFrame = jest.fn();
});
afterAll(() => {
    // 元に戻す
    window.requestAnimationFrame = (globalThis as any)._originalRequestAnimationFrame;
    window.cancelAnimationFrame = (globalThis as any)._originalCancelAnimationFrame;
});

describe('GestureTrail クラスのテスト', () => {
    let gestureTrail: GestureTrail;
    let mockAppendChild: jest.SpyInstance;
    let mockRemoveChild: jest.SpyInstance;
    let mockCreateElement: jest.SpyInstance;
    let mockAddEventListener: jest.SpyInstance;
    let mockRemoveEventListener: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();

        // 毎回新しいmockContext/mockCanvasを生成
        mockContext = {
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            stroke: jest.fn(),
            getImageData: jest.fn().mockReturnValue({ data: new Uint8ClampedArray() }),
            putImageData: jest.fn(),
            strokeStyle: '',
            lineWidth: 0,
            lineCap: 'butt' as CanvasLineCap,
            lineJoin: 'miter' as CanvasLineJoin,
        };
        mockCanvas = {
            getContext: jest.fn().mockReturnValue(mockContext),
            style: {
                position: '',
                top: '',
                left: '',
                width: '',
                height: '',
                pointerEvents: '',
                zIndex: '',
            },
            width: 0,
            height: 0,
            parentNode: {
                removeChild: jest.fn(),
            },
        } as unknown as HTMLCanvasElement;

        mockCreateElement = jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas);
        mockAppendChild = jest.spyOn(document.body, 'appendChild').mockImplementation();
        mockRemoveChild = jest.spyOn(mockCanvas.parentNode!, 'removeChild').mockImplementation();

        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1920 });
        Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 1080 });
        Object.defineProperty(window, 'scrollX', { writable: true, configurable: true, value: 0 });
        Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 0 });

        mockAddEventListener = jest.spyOn(window, 'addEventListener');
        mockRemoveEventListener = jest.spyOn(window, 'removeEventListener');

        gestureTrail = new GestureTrail({ color: 'rgba(255, 0, 0, 0.5)', width: 3, zIndex: 999999 });
    });

    afterEach(() => {
        // テスト後にインスタンスを破棄
        gestureTrail.destroy();
        // スパイをリストア
        mockCreateElement.mockRestore();
        mockAppendChild.mockRestore();
        // mockRemoveChild は mockCanvas.parentNode 上にあるため、個別にリストアは不要かも
        mockAddEventListener.mockRestore();
        mockRemoveEventListener.mockRestore();
    });

    test('コンストラクタ: オプションなしで初期化されること', () => {
        // デフォルト値で初期化
        expect((gestureTrail as any).trailColor).toBe('rgba(255, 0, 0, 0.5)');
        expect((gestureTrail as any).trailWidth).toBe(3);
        expect((gestureTrail as any).zIndex).toBe(999999);
        expect((gestureTrail as any).lineCap).toBe('round');
        expect((gestureTrail as any).lineJoin).toBe('round');
    });

    test('コンストラクタ: 指定されたオプションで初期化されること', () => {
        const options: GestureTrailOptions = {
            color: 'blue',
            width: 5,
            zIndex: 1000,
        };
        gestureTrail = new GestureTrail(options);
        expect((gestureTrail as any).trailColor).toBe(options.color);
        expect((gestureTrail as any).trailWidth).toBe(options.width);
        expect((gestureTrail as any).zIndex).toBe(options.zIndex);
        // lineCap/lineJoinはデフォルト値
        expect((gestureTrail as any).lineCap).toBe('round');
        expect((gestureTrail as any).lineJoin).toBe('round');
    });

    test('startDrawing: キャンバスを作成し、描画を開始すること', () => {
        const startPoint = new Point(10, 20);
        gestureTrail.startDrawing(startPoint);

        expect(mockCreateElement).toHaveBeenCalledWith('canvas');
        expect(mockAppendChild).toHaveBeenCalledWith(mockCanvas);
        expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
        expect(mockContext.beginPath).toHaveBeenCalled();
        expect(mockContext.moveTo).toHaveBeenCalledWith(10, 20); // scrollX/Y = 0
        expect((gestureTrail as any).lastPoint).toBe(startPoint);
        expect(Logger.debug).toHaveBeenCalledWith('ジェスチャトレイル描画開始', { point: startPoint });
        expect(mockAddEventListener).toHaveBeenCalledWith('resize', (gestureTrail as any).handleResize);
    });

    test('startDrawing: コンテキスト取得失敗時にエラーログが出力されること', () => {
        mockCanvas.getContext = jest.fn().mockReturnValue(null); // コンテキスト取得失敗をシミュレート
        const startPoint = new Point(10, 20);
        gestureTrail.startDrawing(startPoint);

        expect(Logger.error).toHaveBeenCalledWith('Canvas 2D コンテキストの取得に失敗しました');
        expect(mockAppendChild).toHaveBeenCalled(); // キャンバスは追加されるが…
        expect(mockRemoveChild).toHaveBeenCalledWith(mockCanvas); // すぐに削除される
        expect((gestureTrail as any).canvas).toBeNull();
        expect((gestureTrail as any).context).toBeNull();
    });

    test('updateTrail: トレイルを更新し、ログが出力されること', async () => {
        const startPoint = new Point(10, 20);
        gestureTrail.startDrawing(startPoint); // 描画開始

        const nextPoint = new Point(15, 25); // 十分な距離がある点
        gestureTrail.updateTrail(nextPoint);
        // requestAnimationFrameのコールバックが確実に実行されるように
        await Promise.resolve();

        expect(window.requestAnimationFrame).toHaveBeenCalled();
        expect(mockContext.lineTo).toHaveBeenCalledWith(15, 25); // scrollX/Y = 0
        expect(mockContext.stroke).toHaveBeenCalled();
        expect((gestureTrail as any).lastPoint).toBe(nextPoint);
        expect(Logger.debug).not.toHaveBeenCalledWith();
    });

    test('updateTrail: 距離が近すぎる場合は描画しないこと', async () => {
        const startPoint = new Point(10, 20);
        gestureTrail.startDrawing(startPoint);

        const closePoint = new Point(10.5, 20.5); // 距離が2未満
        gestureTrail.updateTrail(closePoint);
        await Promise.resolve();

        expect(window.requestAnimationFrame).toHaveBeenCalled();
        expect(mockContext.lineTo).not.toHaveBeenCalled();
        expect(mockContext.stroke).not.toHaveBeenCalled();
        expect((gestureTrail as any).lastPoint).toBe(startPoint); // lastPoint は更新されない
    });

    test('updateTrail: 描画が開始されていない場合は何もしないこと', () => {
        const point = new Point(10, 10);
        gestureTrail.updateTrail(point); // startDrawing 前に呼び出し

        expect(window.requestAnimationFrame).not.toHaveBeenCalled();
        expect(Logger.debug).not.toHaveBeenCalled();
    });

    test('clearTrail: キャンバスを削除し、状態をリセットすること', async () => {
        const startPoint = new Point(10, 20);
        gestureTrail.startDrawing(startPoint);
        const nextPoint = new Point(15, 25);
        gestureTrail.updateTrail(nextPoint); // animationFrameId が設定される
        await Promise.resolve();

        gestureTrail.clearTrail();

        expect(window.cancelAnimationFrame).toHaveBeenCalled();
        expect(mockRemoveChild).toHaveBeenCalledWith(mockCanvas);
        expect((gestureTrail as any).canvas).toBeNull();
        expect((gestureTrail as any).context).toBeNull();
        expect((gestureTrail as any).lastPoint).toBeNull();
        expect((gestureTrail as any).animationFrameId).toBeNull();
        expect(Logger.debug).toHaveBeenCalledWith('ジェスチャトレイル描画クリア');
    });

    test('clearTrail: キャンバスが存在しない場合は何もしないこと', () => {
        gestureTrail.clearTrail(); // startDrawing 前に呼び出し

        expect(window.cancelAnimationFrame).not.toHaveBeenCalled();
        expect(mockRemoveChild).not.toHaveBeenCalled();
        expect(Logger.debug).not.toHaveBeenCalledWith('ジェスチャトレイル描画クリア');
    });

    test('destroy: clearTrail を呼び出し、リサイズリスナーを削除すること', () => {
        const startPoint = new Point(10, 20);
        gestureTrail.startDrawing(startPoint); // リスナーが登録される

        const clearTrailSpy = jest.spyOn(gestureTrail, 'clearTrail');
        gestureTrail.destroy();

        expect(clearTrailSpy).toHaveBeenCalled();
        expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', (gestureTrail as any).handleResize);
        expect(Logger.debug).toHaveBeenCalledWith('GestureTrail インスタンス破棄');
    });

    test('handleResize: ウィンドウリサイズ時にキャンバスサイズを更新し、既存の描画を復元すること', async () => {
        const startPoint = new Point(10, 20);
        gestureTrail.startDrawing(startPoint);
        gestureTrail.updateTrail(new Point(30, 40)); // 何か描画しておく
        await Promise.resolve();

        // canvasがnullでないことを保証
        expect((gestureTrail as any).canvas).not.toBeNull();
        const originalWidth = (gestureTrail as any).canvas.width;
        const originalHeight = (gestureTrail as any).canvas.height;
        const mockImageData = { data: new Uint8ClampedArray([1, 2, 3, 4]) };
        mockContext.getImageData.mockReturnValue(mockImageData);

        Object.defineProperty(window, 'innerWidth', { value: 800 });
        Object.defineProperty(window, 'innerHeight', { value: 600 });

        (gestureTrail as any).handleResize();

        expect(mockContext.getImageData).toHaveBeenCalledWith(0, 0, originalWidth, originalHeight);
        expect(mockCanvas.width).toBe(800);
        expect(mockCanvas.height).toBe(600);
        expect(mockContext.strokeStyle).toBe((gestureTrail as any).trailColor);
        expect(mockContext.lineWidth).toBe((gestureTrail as any).trailWidth);
        expect(mockContext.lineCap).toBe((gestureTrail as any).lineCap);
        expect(mockContext.lineJoin).toBe((gestureTrail as any).lineJoin);
        expect(mockContext.putImageData).toHaveBeenCalledWith(mockImageData, 0, 0);
        expect(Logger.debug).toHaveBeenCalledWith('ジェスチャトレイル キャンバスリサイズ');
    });

    test('handleResize: キャンバスが存在しない場合は何もしないこと', () => {
        // startDrawing を呼ばずに handleResize を呼び出す
        (gestureTrail as any).handleResize();
        expect(mockContext.getImageData).not.toHaveBeenCalled();
        expect(Logger.debug).not.toHaveBeenCalledWith('ジェスチャトレイル キャンバスリサイズ');
    });
});