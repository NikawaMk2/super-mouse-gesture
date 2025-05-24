import { DirectionTrail } from '../../../src/content/models/direction_trail';
import { Direction } from '../../../src/content/models/direction';

describe('DirectionTrail', () => {
    let directionTrail: DirectionTrail;

    beforeEach(() => {
        directionTrail = new DirectionTrail();
    });

    describe('add', () => {
        it('NONE以外の方向は追加される', () => {
            directionTrail.add(Direction.UP);
            expect(directionTrail.getLength()).toBe(1);
            expect(directionTrail.getLastDirection()).toBe(Direction.UP);
        });

        it('NONE方向は追加されない', () => {
            directionTrail.add(Direction.NONE);
            expect(directionTrail.getLength()).toBe(0);
            expect(directionTrail.isEmpty()).toBe(true);
        });

        it('同じ方向が連続する場合は追加されない', () => {
            directionTrail.add(Direction.UP);
            directionTrail.add(Direction.UP);
            expect(directionTrail.getLength()).toBe(1);
            expect(directionTrail.getLastDirection()).toBe(Direction.UP);
        });

        it('異なる方向は順次追加される', () => {
            directionTrail.add(Direction.UP);
            directionTrail.add(Direction.RIGHT);
            directionTrail.add(Direction.DOWN);
            expect(directionTrail.getLength()).toBe(3);
            expect(directionTrail.getLastDirection()).toBe(Direction.DOWN);
        });

        it('異なる方向を挟んだ後であれば同じ方向でも追加される', () => {
            directionTrail.add(Direction.UP);
            directionTrail.add(Direction.RIGHT);
            directionTrail.add(Direction.UP);
            expect(directionTrail.getLength()).toBe(3);
            expect(directionTrail.toArray()).toEqual([Direction.UP, Direction.RIGHT, Direction.UP]);
        });
    });

    describe('getLastDirection', () => {
        it('履歴が空の場合はundefinedを返す', () => {
            expect(directionTrail.getLastDirection()).toBeUndefined();
        });

        it('最後に追加された方向を返す', () => {
            directionTrail.add(Direction.UP);
            directionTrail.add(Direction.RIGHT);
            expect(directionTrail.getLastDirection()).toBe(Direction.RIGHT);
        });
    });

    describe('toPattern', () => {
        it('履歴が空の場合は空文字列を返す', () => {
            expect(directionTrail.toPattern()).toBe('');
        });

        it('単一方向の場合は方向文字列を返す', () => {
            directionTrail.add(Direction.UP);
            expect(directionTrail.toPattern()).toBe('up');
        });

        it('複数方向の場合はカンマ区切りのパターン文字列を返す', () => {
            directionTrail.add(Direction.UP);
            directionTrail.add(Direction.RIGHT);
            directionTrail.add(Direction.DOWN);
            expect(directionTrail.toPattern()).toBe('up,right,down');
        });
    });

    describe('getLength', () => {
        it('空の履歴の場合は0を返す', () => {
            expect(directionTrail.getLength()).toBe(0);
        });

        it('方向追加後は正しい長さを返す', () => {
            directionTrail.add(Direction.UP);
            directionTrail.add(Direction.RIGHT);
            expect(directionTrail.getLength()).toBe(2);
        });
    });

    describe('isEmpty', () => {
        it('空の履歴の場合はtrueを返す', () => {
            expect(directionTrail.isEmpty()).toBe(true);
        });

        it('方向追加後はfalseを返す', () => {
            directionTrail.add(Direction.UP);
            expect(directionTrail.isEmpty()).toBe(false);
        });

        it('リセット後はtrueを返す', () => {
            directionTrail.add(Direction.UP);
            directionTrail.reset();
            expect(directionTrail.isEmpty()).toBe(true);
        });
    });

    describe('reset', () => {
        it('全ての方向履歴をクリアする', () => {
            directionTrail.add(Direction.UP);
            directionTrail.add(Direction.RIGHT);
            directionTrail.reset();
            expect(directionTrail.getLength()).toBe(0);
            expect(directionTrail.isEmpty()).toBe(true);
            expect(directionTrail.getLastDirection()).toBeUndefined();
        });
    });

    describe('toArray', () => {
        it('空の履歴の場合は空配列を返す', () => {
            expect(directionTrail.toArray()).toEqual([]);
        });

        it('方向配列の読み取り専用コピーを返す', () => {
            directionTrail.add(Direction.UP);
            directionTrail.add(Direction.RIGHT);
            const array = directionTrail.toArray();
            expect(array).toEqual([Direction.UP, Direction.RIGHT]);
            
            // 返された配列は読み取り専用のはずなので、元の配列に影響しない
            expect(array.length).toBe(2);
        });

        it('返された配列を変更しても元の履歴には影響しない', () => {
            directionTrail.add(Direction.UP);
            const array = directionTrail.toArray() as Direction[];
            // 型アサーションで配列を変更可能にして変更を試行
            array.push(Direction.DOWN);
            
            // 元のtrailには影響しない
            expect(directionTrail.getLength()).toBe(1);
            expect(directionTrail.toArray()).toEqual([Direction.UP]);
        });
    });

    describe('複雑なシナリオ', () => {
        it('複雑なジェスチャパターンを適切に処理する', () => {
            // 複雑なジェスチャパターンをテスト: 上→右→下→左
            directionTrail.add(Direction.UP);
            directionTrail.add(Direction.RIGHT);
            directionTrail.add(Direction.DOWN);
            directionTrail.add(Direction.LEFT);
            
            expect(directionTrail.getLength()).toBe(4);
            expect(directionTrail.toPattern()).toBe('up,right,down,left');
            expect(directionTrail.getLastDirection()).toBe(Direction.LEFT);
        });

        it('複雑なパターンでNONE方向を無視する', () => {
            directionTrail.add(Direction.UP);
            directionTrail.add(Direction.NONE);
            directionTrail.add(Direction.RIGHT);
            directionTrail.add(Direction.NONE);
            directionTrail.add(Direction.DOWN);
            
            expect(directionTrail.getLength()).toBe(3);
            expect(directionTrail.toPattern()).toBe('up,right,down');
        });
    });
}); 