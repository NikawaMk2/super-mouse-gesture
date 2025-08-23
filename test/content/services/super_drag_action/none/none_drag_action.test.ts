import { NoneDragAction } from '../../../../../src/content/services/super_drag_action/none/none_drag_action';
import { DragType } from '../../../../../src/content/models/drag_type';
import { Direction } from '../../../../../src/content/models/direction';
import Logger from '../../../../../src/common/logger/logger';

// モック設定
jest.mock('../../../../../src/common/logger/logger');

describe('NoneDragAction', () => {
    let action: NoneDragAction;

    beforeEach(() => {
        action = new NoneDragAction();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('コンストラクタ', () => {
        describe('事後条件', () => {
            it('有効なインスタンスが作成されること', () => {
                const instance = new NoneDragAction();
                expect(instance).toBeDefined();
                expect(instance).toBeInstanceOf(NoneDragAction);
            });
        });
    });

    describe('execute', () => {
        const createExecuteOptions = (overrides = {}) => ({
            type: DragType.TEXT,
            direction: Direction.RIGHT,
            actionName: 'none',
            params: {},
            selectedValue: 'test',
            ...overrides
        });

        describe('事前条件', () => {
            it('必要なオプションが提供されること', async () => {
                const options = createExecuteOptions();
                await expect(action.execute(options)).resolves.not.toThrow();
            });

            it('nullのオプションでもエラーが発生しないこと', async () => {
                await expect(action.execute(null as any)).resolves.not.toThrow();
            });

            it('undefinedのオプションでもエラーが発生しないこと', async () => {
                await expect(action.execute(undefined as any)).resolves.not.toThrow();
            });
        });

        describe('事後条件', () => {
            it('デバッグログが出力されること', async () => {
                const options = createExecuteOptions();
                await action.execute(options);

                expect(Logger.debug).toHaveBeenCalledWith(
                    'NoneDragAction: execute() called',
                    { options }
                );
            });

            it('Promiseが正常に解決されること', async () => {
                const options = createExecuteOptions();
                const result = await action.execute(options);
                expect(result).toBeUndefined();
            });

            it('実際のアクション処理は実行されないこと', async () => {
                const options = createExecuteOptions();
                await action.execute(options);

                // ログ以外の副作用がないことを確認
                expect(Logger.debug).toHaveBeenCalledTimes(1);
            });
        });

        describe('不変条件', () => {
            it('複数回実行してもエラーが発生しないこと', async () => {
                const options = createExecuteOptions();
                
                await expect(action.execute(options)).resolves.not.toThrow();
                await expect(action.execute(options)).resolves.not.toThrow();
                await expect(action.execute(options)).resolves.not.toThrow();
                
                expect(Logger.debug).toHaveBeenCalledTimes(3);
            });

            it('異なるオプションでも正常に動作すること', async () => {
                const options1 = createExecuteOptions({
                    type: DragType.TEXT,
                    direction: Direction.LEFT,
                    selectedValue: 'text1'
                });
                const options2 = createExecuteOptions({
                    type: DragType.LINK,
                    direction: Direction.UP,
                    selectedValue: 'link1'
                });
                const options3 = createExecuteOptions({
                    type: DragType.IMAGE,
                    direction: Direction.DOWN,
                    selectedValue: 'image1'
                });

                await action.execute(options1);
                await action.execute(options2);
                await action.execute(options3);

                expect(Logger.debug).toHaveBeenCalledTimes(3);
                expect(Logger.debug).toHaveBeenNthCalledWith(1, 'NoneDragAction: execute() called', { options: options1 });
                expect(Logger.debug).toHaveBeenNthCalledWith(2, 'NoneDragAction: execute() called', { options: options2 });
                expect(Logger.debug).toHaveBeenNthCalledWith(3, 'NoneDragAction: execute() called', { options: options3 });
            });
        });

        describe('境界値テスト', () => {
            it('空のparamsでも正常に動作すること', async () => {
                const options = createExecuteOptions({ params: {} });
                await expect(action.execute(options)).resolves.not.toThrow();
                expect(Logger.debug).toHaveBeenCalledWith(
                    'NoneDragAction: execute() called',
                    { options }
                );
            });

            it('nullのparamsでも正常に動作すること', async () => {
                const options = createExecuteOptions({ params: null });
                await expect(action.execute(options)).resolves.not.toThrow();
                expect(Logger.debug).toHaveBeenCalledWith(
                    'NoneDragAction: execute() called',
                    { options }
                );
            });

            it('空文字列のselectedValueでも正常に動作すること', async () => {
                const options = createExecuteOptions({ selectedValue: '' });
                await expect(action.execute(options)).resolves.not.toThrow();
                expect(Logger.debug).toHaveBeenCalledWith(
                    'NoneDragAction: execute() called',
                    { options }
                );
            });

            it('NONEタイプでも正常に動作すること', async () => {
                const options = createExecuteOptions({
                    type: DragType.NONE,
                    direction: Direction.NONE
                });
                await expect(action.execute(options)).resolves.not.toThrow();
                expect(Logger.debug).toHaveBeenCalledWith(
                    'NoneDragAction: execute() called',
                    { options }
                );
            });
        });

        describe('異常系テスト', () => {
            it('不正なtypeでもエラーが発生しないこと', async () => {
                const options = createExecuteOptions({ type: 'invalid' as any });
                await expect(action.execute(options)).resolves.not.toThrow();
                expect(Logger.debug).toHaveBeenCalledWith(
                    'NoneDragAction: execute() called',
                    { options }
                );
            });

            it('不正なdirectionでもエラーが発生しないこと', async () => {
                const options = createExecuteOptions({ direction: 'invalid' as any });
                await expect(action.execute(options)).resolves.not.toThrow();
                expect(Logger.debug).toHaveBeenCalledWith(
                    'NoneDragAction: execute() called',
                    { options }
                );
            });

            it('部分的なオプションでもエラーが発生しないこと', async () => {
                const partialOptions = { type: DragType.TEXT };
                await expect(action.execute(partialOptions as any)).resolves.not.toThrow();
                expect(Logger.debug).toHaveBeenCalledWith(
                    'NoneDragAction: execute() called',
                    { options: partialOptions }
                );
            });
        });
    });
});
