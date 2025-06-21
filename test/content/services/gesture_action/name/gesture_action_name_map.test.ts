import { GestureActionNameMap } from '../../../../../src/content/services/gesture_action/name/gesture_acrion_name_map';
import { GestureActionType } from '../../../../../src/content/services/gesture_action/gesture_action_type';

describe('GestureActionNameMap - 契約による設計テスト', () => {
    
    describe('事前条件の検証', () => {
        test('有効なGestureActionTypeを渡した場合、処理が正常に実行される', () => {
            // Arrange & Act & Assert
            expect(() => {
                GestureActionNameMap.get(GestureActionType.NEXT_TAB);
            }).not.toThrow();
        });

        test('nullを渡した場合の処理', () => {
            // Arrange & Act & Assert
            expect(() => {
                GestureActionNameMap.get(null as any);
            }).toThrow('actionTypeは有効な文字列である必要があります');
        });

        test('undefinedを渡した場合の処理', () => {
            // Arrange & Act & Assert
            expect(() => {
                GestureActionNameMap.get(undefined as any);
            }).toThrow('actionTypeは有効な文字列である必要があります');
        });

        test('無効な文字列を渡した場合の処理', () => {
            // Arrange & Act & Assert
            expect(() => {
                GestureActionNameMap.get('invalid_action' as any);
            }).toThrow('未対応のGestureActionType: invalid_action');
        });

        test('空文字列を渡した場合の処理', () => {
            // Arrange & Act & Assert
            expect(() => {
                GestureActionNameMap.get('' as any);
            }).toThrow('actionTypeは有効な文字列である必要があります');
        });
    });

    describe('事後条件の検証', () => {
        test('有効なGestureActionTypeに対して、必ず非空文字列を返す', () => {
            // Arrange
            const validActionTypes = Object.values(GestureActionType);

            // Act & Assert
            validActionTypes.forEach(actionType => {
                const result = GestureActionNameMap.get(actionType);
                
                expect(result).toBeDefined();
                expect(typeof result).toBe('string');
                expect(result.length).toBeGreaterThan(0);
                expect(result.trim()).toBe(result); // トリムされた状態であること
            });
        });

        test('同じGestureActionTypeに対して、常に同じ文字列を返す（冪等性）', () => {
            // Arrange
            const actionType = GestureActionType.NEXT_TAB;

            // Act
            const result1 = GestureActionNameMap.get(actionType);
            const result2 = GestureActionNameMap.get(actionType);
            const result3 = GestureActionNameMap.get(actionType);

            // Assert
            expect(result1).toBe(result2);
            expect(result2).toBe(result3);
        });

        test('返される文字列は日本語名である', () => {
            // Arrange
            const knownActionTypes = [
                { type: GestureActionType.GO_BACK, expectedName: '戻る' },
                { type: GestureActionType.FORWARD, expectedName: '進む' },
                { type: GestureActionType.RELOAD_PAGE, expectedName: '再読み込み' },
                { type: GestureActionType.STOP_LOADING, expectedName: '読み込み停止' },
                { type: GestureActionType.SCROLL_TO_TOP, expectedName: 'ページトップへ' },
                { type: GestureActionType.SCROLL_TO_BOTTOM, expectedName: 'ページ末尾へ' },
                { type: GestureActionType.ZOOM_IN, expectedName: 'ズームイン' },
                { type: GestureActionType.ZOOM_OUT, expectedName: 'ズームアウト' },
                { type: GestureActionType.SHOW_FIND_BAR, expectedName: '検索バー表示' },
                { type: GestureActionType.NEW_TAB, expectedName: '新しいタブ' },
                { type: GestureActionType.CLOSE_TAB, expectedName: 'タブを閉じる' },
                { type: GestureActionType.CLOSE_TAB_TO_LEFT, expectedName: 'このタブを閉じて左のタブに移動' },
                { type: GestureActionType.CLOSE_TAB_TO_RIGHT, expectedName: 'このタブを閉じて右のタブに移動' },
                { type: GestureActionType.NEXT_TAB, expectedName: '右のタブに移動' },
                { type: GestureActionType.PREV_TAB, expectedName: '左のタブに移動' },
                { type: GestureActionType.NONE, expectedName: 'なし' },
            ];

            // Act & Assert
            knownActionTypes.forEach(({ type, expectedName }) => {
                const result = GestureActionNameMap.get(type);
                expect(result).toBe(expectedName);
            });
        });
    });

    describe('不変条件の検証', () => {
        test('すべての定義済みGestureActionTypeに対して対応するマッピングが存在する', () => {
            // Arrange
            const allActionTypes = Object.values(GestureActionType);

            // Act & Assert
            allActionTypes.forEach(actionType => {
                expect(() => {
                    const result = GestureActionNameMap.get(actionType);
                    expect(result).toBeDefined();
                }).not.toThrow();
            });
        });

        test('マップから取得される各オブジェクトがGestureActionNameインターフェースを実装している', () => {
            // Arrange
            const validActionTypes = Object.values(GestureActionType);

            // Act & Assert
            validActionTypes.forEach(actionType => {
                const result = GestureActionNameMap.get(actionType);
                
                // getJapaneseNameメソッドの結果として有効な文字列が返されることで、
                // インターフェースの実装を間接的に検証
                expect(typeof result).toBe('string');
                expect(result.length).toBeGreaterThan(0);
            });
        });

        test('クラス自体の状態が変更されない（状態不変性）', () => {
            // Arrange
            const actionType = GestureActionType.NEXT_TAB;
            const initialResult = GestureActionNameMap.get(actionType);

            // Act - 複数回アクセス
            GestureActionNameMap.get(GestureActionType.PREV_TAB);
            GestureActionNameMap.get(GestureActionType.NEW_TAB);
            GestureActionNameMap.get(GestureActionType.CLOSE_TAB);
            
            const finalResult = GestureActionNameMap.get(actionType);

            // Assert
            expect(finalResult).toBe(initialResult);
        });
    });

    describe('境界値テスト', () => {
        test('GestureActionType.NONEの場合も適切に処理される', () => {
            // Arrange & Act
            const result = GestureActionNameMap.get(GestureActionType.NONE);

            // Assert
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(0);
        });

        test('すべてのGestureActionTypeが網羅されている', () => {
            // Arrange
            const allActionTypes = Object.values(GestureActionType);
            const expectedCount = allActionTypes.length;

            // Act - すべてのアクションタイプで正常に値が取得できることを確認
            let successCount = 0;
            allActionTypes.forEach(actionType => {
                try {
                    const result = GestureActionNameMap.get(actionType);
                    if (result && typeof result === 'string' && result.length > 0) {
                        successCount++;
                    }
                } catch (error) {
                    // エラーが発生した場合はカウントしない
                }
            });

            // Assert
            expect(successCount).toBe(expectedCount);
        });

        test('各アクションタイプに対して一意の日本語名が返される', () => {
            // Arrange
            const allActionTypes = Object.values(GestureActionType);
            const nameSet = new Set<string>();

            // Act
            allActionTypes.forEach(actionType => {
                const result = GestureActionNameMap.get(actionType);
                nameSet.add(result);
            });

            // Assert - 重複がないことを確認
            expect(nameSet.size).toBe(allActionTypes.length);
        });
    });
}); 