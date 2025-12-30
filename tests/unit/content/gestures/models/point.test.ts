/**
 * point.ts のユニットテスト
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Point } from '@/content/gestures/models/point';
import { GestureDirection } from '@/shared/types/gesture-direction';

describe('Point', () => {
    describe('constructor', () => {
        it('x座標とy座標を指定した場合_座標が正しく設定されること', () => {
            const point = new Point(100, 200);

            // isNone()がfalseであることで座標が有効であることを確認
            expect(point.isNone()).toBe(false);
        });

        it('NaNを座標として指定した場合_isNoneがtrueを返すこと', () => {
            const point = new Point(NaN, NaN);

            expect(point.isNone()).toBe(true);
        });
    });

    describe('Point.NONE', () => {
        it('NONEにアクセスした場合_無効な座標を返すこと', () => {
            expect(Point.NONE.isNone()).toBe(true);
        });
    });

    describe('isNone', () => {
        it('有効な座標の場合_falseを返すこと', () => {
            const point = new Point(0, 0);

            expect(point.isNone()).toBe(false);
        });

        it('x座標がNaNの場合_trueを返すこと', () => {
            const point = new Point(NaN, 100);

            expect(point.isNone()).toBe(true);
        });

        it('y座標がNaNの場合_trueを返すこと', () => {
            const point = new Point(100, NaN);

            expect(point.isNone()).toBe(true);
        });

        it('両方の座標がNaNの場合_trueを返すこと', () => {
            const point = new Point(NaN, NaN);

            expect(point.isNone()).toBe(true);
        });
    });

    describe('getDirection', () => {
        beforeEach(() => {
            vi.spyOn(console, 'warn').mockImplementation(() => { });
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        describe('正常系', () => {
            it('右方向に閾値を超えて移動した場合_RIGHTを返すこと', () => {
                const from = new Point(0, 0);
                const to = new Point(31, 0);

                expect(from.getDirection(to)).toBe(GestureDirection.RIGHT);
            });

            it('左方向に閾値を超えて移動した場合_LEFTを返すこと', () => {
                const from = new Point(0, 0);
                const to = new Point(-31, 0);

                expect(from.getDirection(to)).toBe(GestureDirection.LEFT);
            });

            it('下方向に閾値を超えて移動した場合_DOWNを返すこと', () => {
                const from = new Point(0, 0);
                const to = new Point(0, 31);

                expect(from.getDirection(to)).toBe(GestureDirection.DOWN);
            });

            it('上方向に閾値を超えて移動した場合_UPを返すこと', () => {
                const from = new Point(0, 0);
                const to = new Point(0, -31);

                expect(from.getDirection(to)).toBe(GestureDirection.UP);
            });

            it('閾値ちょうどの右移動の場合_undefinedを返すこと', () => {
                const from = new Point(0, 0);
                const to = new Point(30, 0);

                expect(from.getDirection(to)).toBeUndefined();
            });

            it('閾値ちょうどの左移動の場合_undefinedを返すこと', () => {
                const from = new Point(0, 0);
                const to = new Point(-30, 0);

                expect(from.getDirection(to)).toBeUndefined();
            });

            it('閾値ちょうどの下移動の場合_undefinedを返すこと', () => {
                const from = new Point(0, 0);
                const to = new Point(0, 30);

                expect(from.getDirection(to)).toBeUndefined();
            });

            it('閾値ちょうどの上移動の場合_undefinedを返すこと', () => {
                const from = new Point(0, 0);
                const to = new Point(0, -30);

                expect(from.getDirection(to)).toBeUndefined();
            });

            it('移動量がない場合_undefinedを返すこと', () => {
                const from = new Point(100, 100);
                const to = new Point(100, 100);

                expect(from.getDirection(to)).toBeUndefined();
            });

            it('閾値未満の移動の場合_undefinedを返すこと', () => {
                const from = new Point(0, 0);
                const to = new Point(15, 15);

                expect(from.getDirection(to)).toBeUndefined();
            });
        });

        describe('斜め移動', () => {
            it('右斜め下で横方向が大きい場合_RIGHTを返すこと', () => {
                const from = new Point(0, 0);
                const to = new Point(50, 30);

                expect(from.getDirection(to)).toBe(GestureDirection.RIGHT);
            });

            it('右斜め下で縦方向が大きい場合_DOWNを返すこと', () => {
                const from = new Point(0, 0);
                const to = new Point(30, 50);

                expect(from.getDirection(to)).toBe(GestureDirection.DOWN);
            });

            it('左斜め上で横方向が大きい場合_LEFTを返すこと', () => {
                const from = new Point(0, 0);
                const to = new Point(-50, -30);

                expect(from.getDirection(to)).toBe(GestureDirection.LEFT);
            });

            it('左斜め上で縦方向が大きい場合_UPを返すこと', () => {
                const from = new Point(0, 0);
                const to = new Point(-30, -50);

                expect(from.getDirection(to)).toBe(GestureDirection.UP);
            });

            it('横と縦の移動量が同じで閾値を超える場合_横方向を優先してRIGHTを返すこと', () => {
                const from = new Point(0, 0);
                const to = new Point(50, 50);

                expect(from.getDirection(to)).toBe(GestureDirection.RIGHT);
            });

            it('横と縦の移動量が同じで閾値を超える場合_横方向を優先してLEFTを返すこと', () => {
                const from = new Point(0, 0);
                const to = new Point(-50, -50);

                expect(from.getDirection(to)).toBe(GestureDirection.LEFT);
            });
        });

        describe('異常系', () => {
            it('自身がNONEの場合_undefinedを返すこと', () => {
                const to = new Point(100, 100);

                expect(Point.NONE.getDirection(to)).toBeUndefined();
            });

            it('引数がNONEの場合_undefinedを返すこと', () => {
                const from = new Point(0, 0);

                expect(from.getDirection(Point.NONE)).toBeUndefined();
            });
        });
    });

    describe('calculateDistance', () => {
        it('同じ座標の場合_0を返すこと', () => {
            const point1 = new Point(100, 100);
            const point2 = new Point(100, 100);

            expect(point1.calculateDistance(point2)).toBe(0);
        });

        it('水平方向のみの移動の場合_正しい距離を返すこと', () => {
            const point1 = new Point(0, 0);
            const point2 = new Point(100, 0);

            expect(point1.calculateDistance(point2)).toBe(100);
        });

        it('垂直方向のみの移動の場合_正しい距離を返すこと', () => {
            const point1 = new Point(0, 0);
            const point2 = new Point(0, 100);

            expect(point1.calculateDistance(point2)).toBe(100);
        });

        it('斜め方向の移動の場合_正しい距離を返すこと', () => {
            const point1 = new Point(0, 0);
            const point2 = new Point(3, 4);

            // 3-4-5の三角形
            expect(point1.calculateDistance(point2)).toBe(5);
        });

        it('負の座標間の移動の場合_正しい距離を返すこと', () => {
            const point1 = new Point(-10, -10);
            const point2 = new Point(-13, -14);

            // 3-4-5の三角形
            expect(point1.calculateDistance(point2)).toBe(5);
        });

        it('正の座標から負の座標への移動の場合_正しい距離を返すこと', () => {
            const point1 = new Point(0, 0);
            const point2 = new Point(-3, -4);

            expect(point1.calculateDistance(point2)).toBe(5);
        });
    });

    describe('canvasMoveTo', () => {
        it('コンテキストのmoveToメソッドが正しい座標で呼び出されること', () => {
            const mockContext = {
                moveTo: vi.fn(),
            } as unknown as CanvasRenderingContext2D;

            const point = new Point(50, 100);
            point.canvasMoveTo(mockContext);

            expect(mockContext.moveTo).toHaveBeenCalledWith(50, 100);
            expect(mockContext.moveTo).toHaveBeenCalledTimes(1);
        });

        it('座標が0の場合_moveToが0で呼び出されること', () => {
            const mockContext = {
                moveTo: vi.fn(),
            } as unknown as CanvasRenderingContext2D;

            const point = new Point(0, 0);
            point.canvasMoveTo(mockContext);

            expect(mockContext.moveTo).toHaveBeenCalledWith(0, 0);
        });

        it('負の座標の場合_moveToが負の値で呼び出されること', () => {
            const mockContext = {
                moveTo: vi.fn(),
            } as unknown as CanvasRenderingContext2D;

            const point = new Point(-25, -50);
            point.canvasMoveTo(mockContext);

            expect(mockContext.moveTo).toHaveBeenCalledWith(-25, -50);
        });
    });

    describe('canvasLineTo', () => {
        it('コンテキストのlineToメソッドが正しい座標で呼び出されること', () => {
            const mockContext = {
                lineTo: vi.fn(),
            } as unknown as CanvasRenderingContext2D;

            const point = new Point(150, 200);
            point.canvasLineTo(mockContext);

            expect(mockContext.lineTo).toHaveBeenCalledWith(150, 200);
            expect(mockContext.lineTo).toHaveBeenCalledTimes(1);
        });

        it('座標が0の場合_lineToが0で呼び出されること', () => {
            const mockContext = {
                lineTo: vi.fn(),
            } as unknown as CanvasRenderingContext2D;

            const point = new Point(0, 0);
            point.canvasLineTo(mockContext);

            expect(mockContext.lineTo).toHaveBeenCalledWith(0, 0);
        });

        it('負の座標の場合_lineToが負の値で呼び出されること', () => {
            const mockContext = {
                lineTo: vi.fn(),
            } as unknown as CanvasRenderingContext2D;

            const point = new Point(-75, -100);
            point.canvasLineTo(mockContext);

            expect(mockContext.lineTo).toHaveBeenCalledWith(-75, -100);
        });
    });
});
