import { SuperDragActionType } from '../../../../src/content/services/super_drag_action/super_drag_action_type';

describe('SuperDragActionType', () => {
    it('定義済みの値のみ許容されること', () => {
        // 型安全のため、SuperDragActionType型の変数には定義済みの値しか代入できない
        const value: SuperDragActionType = SuperDragActionType.SEARCH_GOOGLE;
        expect(value).toBe('searchGoogle');
    });

    it('未定義の値は型エラーとなること（コンパイルエラー）', () => {
        // @ts-expect-error: 型安全のため未定義値は代入できない
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const value: SuperDragActionType = 'unknownAction';
    });
}); 