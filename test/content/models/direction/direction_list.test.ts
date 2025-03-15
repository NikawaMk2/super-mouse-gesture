import DirectionList from '../../../../src/content/models/direcrion/direcrion_list'
import { Direction } from '../../../../src/content/models/direcrion/direction'

describe('DirectionListクラスのテスト', () => {
    describe('コンストラクタのテスト', () => {
        it('空のリストを引数に指定しても例外がスローされないこと', () => {
            try {
                const direcrionList = new DirectionList([]);
            } catch (error) {
                expect(error).toBeUndefined();
            }
        });

        it('要素数1のリストを引数に指定しても例外がスローされないこと', () => {
            try {
                const direcrionList = new DirectionList([Direction.Down]);
            } catch (error) {
                expect(error).toBeUndefined();
            }
        });

        it('要素の各値が異なるリストを引数に指定しても例外がスローされないこと', () => {
            try {
                const direcrionList = new DirectionList([
                    Direction.Down,
                    Direction.Up,
                    Direction.Left,
                    Direction.Right
                ]);
            } catch (error) {
                expect(error).toBeUndefined();
            }
        });

        it('要素が重複するが、連続しないリストを引数に指定しても例外がスローされないこと', () => {
            try {
                const direcrionList = new DirectionList([
                    Direction.Down,
                    Direction.Up,
                    Direction.Down
                ]);
            } catch (error) {
                expect(error).toBeUndefined();
            }
        });

        it('要素が連続で重複するリストを引数に指定すると例外がスローされること', () => {
            expect(() => new DirectionList([
                Direction.Down,
                Direction.Down,
                Direction.Up
            ])).toThrow();
        });

        it('Direcrion.Noneが含まれるリストを引数に指定すると例外がスローされること', () => {
            expect(() => new DirectionList([
                Direction.Right,
                Direction.None,
                Direction.Left
            ])).toThrow();
        });
    });

    describe('equalsメソッドのテスト', () => {
        it('空のリスト同士は同一であること', () => {
            const direcrionList = new DirectionList([]);
            const checkList = new DirectionList([]);
            expect(direcrionList.equals(checkList)).toBe(true);
        });

        it('同一の要素のみを持つリスト同士は同一であること(要素数1)', () => {
            const direcrionList = new DirectionList([Direction.Down]);
            const checkList = new DirectionList([Direction.Down]);
            expect(direcrionList.equals(checkList)).toBe(true);
        });

        it('同一の要素を持つリスト同士は同一であること(要素数2)', () => {
            const direcrionList = new DirectionList([Direction.Down, Direction.Up]);
            const checkList = new DirectionList([Direction.Down, Direction.Up]);
            expect(direcrionList.equals(checkList)).toBe(true);
        });

        it('異なる要素のみを持つリスト同士は同一ではないこと(要素数1)', () => {
            const direcrionList = new DirectionList([Direction.Right]);
            const checkList = new DirectionList([Direction.Left]);
            expect(direcrionList.equals(checkList)).toBe(false);
        });

        it('異なる要素を持つリスト同士は同一ではないこと(要素数2)', () => {
            const direcrionList = new DirectionList([Direction.Right, Direction.Up]);
            const checkList = new DirectionList([Direction.Down, Direction.Up]);
            expect(direcrionList.equals(checkList)).toBe(false);
        });

        it('同一要素を持つが、順番が異なるリスト同士は同一ではないこと(要素数2)', () => {
            const direcrionList = new DirectionList([Direction.Right, Direction.Left]);
            const checkList = new DirectionList([Direction.Left, Direction.Right]);
            expect(direcrionList.equals(checkList)).toBe(false);
        });
    });

    describe('pushNewDirectionメソッドのテスト', () => {
        it('空のリストに要素を追加できること', () => {
            //arrange
            const direcrionList = new DirectionList([]);
    
            //act
            direcrionList.pushNewDirection(Direction.Right);
    
            //assert
            const checkList = new DirectionList([Direction.Right]);
            expect(direcrionList.equals(checkList)).toBe(true);
        });

        it('末尾の要素が一致していた場合は要素を追加できないこと(要素数1)', () => {
            //arrange
            const direcrionList = new DirectionList([]);

            //act
            direcrionList.pushNewDirection(Direction.Right);
            direcrionList.pushNewDirection(Direction.Right);

            //assert
            const checkList = new DirectionList([Direction.Right]);
            expect(direcrionList.equals(checkList)).toBe(true);
        });

        it('末尾の要素が一致していた場合は要素を追加できないこと(要素数2)', () => {
            //arrange
            const direcrionList = new DirectionList([]);

            //act
            direcrionList.pushNewDirection(Direction.Left);
            direcrionList.pushNewDirection(Direction.Up);
            direcrionList.pushNewDirection(Direction.Up);

            //assert
            const checkList = new DirectionList([
                Direction.Left,
                Direction.Up
            ]);
            expect(direcrionList.equals(checkList)).toBe(true);
        });

        it('Direcrion.Noneが引数に指定された場合、要素を追加できないこと', () => {
            //arrange
            const direcrionList = new DirectionList([]);
    
            //act
            direcrionList.pushNewDirection(Direction.None);
    
            //assert
            const checkList = new DirectionList([]);
            expect(direcrionList.equals(checkList)).toBe(true);
        });
    });
});
