/**
 * @jest-environment jsdom
 */
import { GestureTrail } from '../../../src/content/handlers/gesture_trail';
import { Point } from '../../../src/content/models/point';
import Logger from '../../../src/common/logger/logger';

// Loggerのモック化
jest.mock('../../../src/common/logger/logger', () => ({
    __esModule: true,
    default: {
        debug: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        warn: jest.fn()
    }
}));

describe('GestureTrail', () => {
    let gestureTrail: GestureTrail;
    let mockPoint: Point;
    let createElementSpy: jest.SpyInstance;
    let appendChildSpy: jest.SpyInstance;
    let removeChildSpy: jest.SpyInstance;
    let getContextSpy: jest.SpyInstance;

    beforeEach(() => {
        // テスト前にGestureTrailインスタンスを初期化
        gestureTrail = new GestureTrail();
        mockPoint = new Point(100, 100);
        
        // documentのメソッドをスパイ
        createElementSpy = jest.spyOn(document, 'createElement');
        appendChildSpy = jest.spyOn(document.body, 'appendChild');
        removeChildSpy = jest.spyOn(document.body, 'removeChild');
        getContextSpy = jest.spyOn(HTMLCanvasElement.prototype, 'getContext');
        
        // モックのクリア
        jest.clearAllMocks();
    });

    afterEach(() => {
        // テスト後にGestureTrailを破棄
        gestureTrail.destroy();
        // スパイをリセット
        createElementSpy.mockRestore();
        appendChildSpy.mockRestore();
        removeChildSpy.mockRestore();
        getContextSpy.mockRestore();
    });

    describe('初期化', () => {
        it('デフォルトのオプションで初期化できること', () => {
            expect(gestureTrail).toBeDefined();
        });

        it('カスタムオプションで初期化できること', () => {
            const options = {
                color: 'rgba(0, 255, 0, 0.5)',
                width: 5,
                zIndex: 1000,
                lineCap: 'butt' as CanvasLineCap,
                lineJoin: 'miter' as CanvasLineJoin
            };
            const customGestureTrail = new GestureTrail(options);
            expect(customGestureTrail).toBeDefined();
            customGestureTrail.destroy();
        });
    });

    describe('描画機能', () => {
        it('startDrawingでキャンバスが作成されること', () => {
            gestureTrail.startDrawing(mockPoint);
            expect(createElementSpy).toHaveBeenCalledWith('canvas');
            expect(appendChildSpy).toHaveBeenCalled();
            expect(Logger.debug).toHaveBeenCalledWith('ジェスチャトレイル描画開始', expect.any(Object));
        });

        it('updateTrailでトレイルが更新されること', () => {
            gestureTrail.startDrawing(mockPoint);
            const newPoint = new Point(150, 150);
            gestureTrail.updateTrail(newPoint);
            expect(requestAnimationFrame).toHaveBeenCalled();
            expect(Logger.debug).toHaveBeenCalledWith('ジェスチャトレイル描画更新', expect.any(Object));
        });

        it('clearTrailでトレイルがクリアされること', () => {
            gestureTrail.startDrawing(mockPoint);
            gestureTrail.clearTrail();
            expect(removeChildSpy).toHaveBeenCalled();
            expect(Logger.debug).toHaveBeenCalledWith('ジェスチャトレイル描画クリア');
        });
    });

    describe('リサイズ処理', () => {
        it('ウィンドウリサイズ時にキャンバスが更新されること', () => {
            gestureTrail.startDrawing(mockPoint);
            window.dispatchEvent(new Event('resize'));
            expect(Logger.debug).toHaveBeenCalledWith('ジェスチャトレイル キャンバスリサイズ');
        });
    });

    describe('エラー処理', () => {
        it('Canvas 2D コンテキストの取得に失敗した場合にエラーログが出力されること', () => {
            // Canvas 2D コンテキストの取得を失敗させる
            getContextSpy.mockReturnValue(null);

            gestureTrail.startDrawing(mockPoint);
            expect(Logger.error).toHaveBeenCalledWith('Canvas 2D コンテキストの取得に失敗しました');
        });
    });

    describe('破棄処理', () => {
        it('destroyでリソースが適切に解放されること', () => {
            gestureTrail.startDrawing(mockPoint);
            gestureTrail.destroy();
            expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
            expect(Logger.debug).toHaveBeenCalledWith('GestureTrail インスタンス破棄');
        });
    });
}); 