import { NoneSuperDragActionName } from '../../../../../src/content/services/super_drag_action/name/none_super_drag_action_name';

describe('NoneSuperDragActionName', () => {
    let actionName: NoneSuperDragActionName;

    beforeEach(() => {
        actionName = new NoneSuperDragActionName();
    });

    describe('コンストラクタ', () => {
        describe('事前条件', () => {
            it('引数なしでインスタンス化できること', () => {
                expect(() => new NoneSuperDragActionName()).not.toThrow();
            });
        });

        describe('事後条件', () => {
            it('有効なインスタンスが作成されること', () => {
                const instance = new NoneSuperDragActionName();
                expect(instance).toBeDefined();
                expect(instance).toBeInstanceOf(NoneSuperDragActionName);
            });
        });
    });

    describe('getJapaneseName', () => {
        describe('事前条件', () => {
            it('引数なしで呼び出せること', () => {
                expect(() => actionName.getJapaneseName()).not.toThrow();
            });
        });

        describe('事後条件', () => {
            it('日本語の名前「なし」を返すこと', () => {
                const result = actionName.getJapaneseName();
                expect(result).toBe('なし');
            });
        });

        describe('不変条件', () => {
            it('複数回呼び出しても同じ値を返すこと', () => {
                const result1 = actionName.getJapaneseName();
                const result2 = actionName.getJapaneseName();
                const result3 = actionName.getJapaneseName();

                expect(result1).toBe(result2);
                expect(result2).toBe(result3);
                expect(result1).toBe('なし');
            });

            it('インスタンス状態が変更されないこと', () => {
                const beforeCall = actionName.getJapaneseName();
                actionName.getJapaneseName();
                const afterCall = actionName.getJapaneseName();

                expect(beforeCall).toBe(afterCall);
            });
        });
    });
});
