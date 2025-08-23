import { SuperDragActionNameMap } from '../../../../../src/content/services/super_drag_action/name/super_drag_acrion_name_map';
import { SuperDragActionType } from '../../../../../src/content/services/super_drag_action/super_drag_action_type';

describe('SuperDragActionNameMap', () => {
    describe('get', () => {
        it('SEARCH_GOOGLEに対して正しい日本語名を返すこと', () => {
            const result = SuperDragActionNameMap.get(SuperDragActionType.SEARCH_GOOGLE);
            expect(result).toBe('Googleで検索');
        });

        it('SEARCH_BINGに対して正しい日本語名を返すこと', () => {
            const result = SuperDragActionNameMap.get(SuperDragActionType.SEARCH_BING);
            expect(result).toBe('Bingで検索');
        });

        it('OPEN_AS_URLに対して正しい日本語名を返すこと', () => {
            const result = SuperDragActionNameMap.get(SuperDragActionType.OPEN_AS_URL);
            expect(result).toBe('URLとして開く');
        });

        it('COPY_TEXTに対して正しい日本語名を返すこと', () => {
            const result = SuperDragActionNameMap.get(SuperDragActionType.COPY_TEXT);
            expect(result).toBe('テキストをコピー');
        });

        it('OPEN_IN_BACKGROUND_TABに対して正しい日本語名を返すこと', () => {
            const result = SuperDragActionNameMap.get(SuperDragActionType.OPEN_IN_BACKGROUND_TAB);
            expect(result).toBe('バックグラウンドタブで開く');
        });

        it('OPEN_IN_FOREGROUND_TABに対して正しい日本語名を返すこと', () => {
            const result = SuperDragActionNameMap.get(SuperDragActionType.OPEN_IN_FOREGROUND_TAB);
            expect(result).toBe('フォアグラウンドタブで開く');
        });


        it('COPY_LINK_URLに対して正しい日本語名を返すこと', () => {
            const result = SuperDragActionNameMap.get(SuperDragActionType.COPY_LINK_URL);
            expect(result).toBe('リンクURLをコピー');
        });

        it('OPEN_IMAGE_IN_NEW_TABに対して正しい日本語名を返すこと', () => {
            const result = SuperDragActionNameMap.get(SuperDragActionType.OPEN_IMAGE_IN_NEW_TAB);
            expect(result).toBe('画像を新しいタブで開く');
        });


        it('SEARCH_IMAGE_GOOGLEに対して正しい日本語名を返すこと', () => {
            const result = SuperDragActionNameMap.get(SuperDragActionType.SEARCH_IMAGE_GOOGLE);
            expect(result).toBe('Googleで画像検索');
        });

        it('COPY_IMAGE_URLに対して正しい日本語名を返すこと', () => {
            const result = SuperDragActionNameMap.get(SuperDragActionType.COPY_IMAGE_URL);
            expect(result).toBe('画像URLをコピー');
        });

        it('NONEに対して正しい日本語名を返すこと', () => {
            const result = SuperDragActionNameMap.get(SuperDragActionType.NONE);
            expect(result).toBe('なし');
        });

        it('nullのactionTypeに対してエラーを投げること', () => {
            expect(() => {
                SuperDragActionNameMap.get(null as any);
            }).toThrow('actionTypeは有効な文字列である必要があります');
        });

        it('undefinedのactionTypeに対してエラーを投げること', () => {
            expect(() => {
                SuperDragActionNameMap.get(undefined as any);
            }).toThrow('actionTypeは有効な文字列である必要があります');
        });

        it('文字列以外のactionTypeに対してエラーを投げること', () => {
            expect(() => {
                SuperDragActionNameMap.get(123 as any);
            }).toThrow('actionTypeは有効な文字列である必要があります');
        });

        it('未対応のactionTypeに対してエラーを投げること', () => {
            expect(() => {
                SuperDragActionNameMap.get('unsupported' as any);
            }).toThrow('未対応のSuperDragActionType: unsupported');
        });
    });
}); 