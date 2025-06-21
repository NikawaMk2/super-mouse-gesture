import { Point } from '../../../src/content/models/point';
import { Direction } from '../../../src/content/models/direction';

describe('Point', () => {
    describe('isNone', () => {
        it('NONE定数はisNoneがtrueを返す', () => {
            expect(Point.NONE.isNone()).toBe(true);
        });
        it('通常のPointはisNoneがfalseを返す', () => {
            const p = new Point(10, 20);
            expect(p.isNone()).toBe(false);
        });
    });

    describe('getDirection', () => {
        it('自身または引数がNONEの場合はDirection.NONE', () => {
            const p = new Point(0, 0);
            expect(p.getDirection(Point.NONE)).toBe(Direction.NONE);
            expect(Point.NONE.getDirection(p)).toBe(Direction.NONE);
        });
        it('右方向を検出する', () => {
            const p1 = new Point(0, 0);
            const p2 = new Point(40, 0); // dx=40 > THRESHOLD
            expect(p1.getDirection(p2)).toBe(Direction.RIGHT);
        });
        it('左方向を検出する', () => {
            const p1 = new Point(50, 0);
            const p2 = new Point(10, 0); // dx=-40 < -THRESHOLD
            expect(p1.getDirection(p2)).toBe(Direction.LEFT);
        });
        it('下方向を検出する', () => {
            const p1 = new Point(0, 0);
            const p2 = new Point(0, 40); // dy=40 > THRESHOLD
            expect(p1.getDirection(p2)).toBe(Direction.DOWN);
        });
        it('上方向を検出する', () => {
            const p1 = new Point(0, 50);
            const p2 = new Point(0, 0); // dy=-50 < -THRESHOLD
            expect(p1.getDirection(p2)).toBe(Direction.UP);
        });
        it('閾値未満の場合はDirection.NONE', () => {
            const p1 = new Point(0, 0);
            const p2 = new Point(20, 10); // dx=20, dy=10 (どちらもTHRESHOLD未満)
            expect(p1.getDirection(p2)).toBe(Direction.NONE);
        });
        it('dx,dyが同じ大きさでdx優先', () => {
            const p1 = new Point(0, 0);
            const p2 = new Point(40, 40); // dx=40, dy=40 → dx優先でRIGHT
            expect(p1.getDirection(p2)).toBe(Direction.RIGHT);
        });
    });

    describe('canvasMoveTo', () => {
        it('canvasコンテキストのmoveToメソッドを座標で呼び出す', () => {
            const mockContext = {
                moveTo: jest.fn()
            } as unknown as CanvasRenderingContext2D;
            
            const point = new Point(10, 20);
            point.canvasMoveTo(mockContext);
            
            expect(mockContext.moveTo).toHaveBeenCalledWith(10, 20);
        });
    });

    describe('canvasLineTo', () => {
        it('canvasコンテキストのlineToメソッドを座標で呼び出す', () => {
            const mockContext = {
                lineTo: jest.fn()
            } as unknown as CanvasRenderingContext2D;
            
            const point = new Point(30, 40);
            point.canvasLineTo(mockContext);
            
            expect(mockContext.lineTo).toHaveBeenCalledWith(30, 40);
        });
    });

    describe('calculateDistance', () => {
        it('2点間の距離を正しく計算する', () => {
            const p1 = new Point(0, 0);
            const p2 = new Point(3, 4); // 3-4-5の直角三角形
            
            expect(p1.calculateDistance(p2)).toBe(5);
        });

        it('同じ点の場合は距離0を返す', () => {
            const p1 = new Point(10, 20);
            const p2 = new Point(10, 20);
            
            expect(p1.calculateDistance(p2)).toBe(0);
        });

        it('NONEポイントとの距離計算でNaNを返す', () => {
            const p1 = new Point(10, 20);
            
            expect(p1.calculateDistance(Point.NONE)).toBeNaN();
        });
    });
}); 