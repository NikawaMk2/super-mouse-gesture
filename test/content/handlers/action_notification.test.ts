/**
 * @jest-environment jsdom
 */
import { ActionNotification } from '../../../src/content/handlers/action_notification';
import Logger from '../../../src/common/logger/logger';
import { GestureActionType } from '../../../src/content/services/gesture_action/gesture_action_type';
import { SuperDragActionType } from '../../../src/content/services/super_drag_action/super_drag_action_type';

// Loggerをモック化
jest.mock('../../../src/common/logger/logger');

describe('ActionNotification', () => {
    beforeEach(() => {
        // 各テスト前にDOMをクリーンアップ
        document.body.innerHTML = '';
        // プライベートフィールドをリセット
        (ActionNotification as any).notificationElem = null;
        (ActionNotification as any).lastActionName = null;
        jest.clearAllMocks();
    });

    afterEach(() => {
        // テスト後のクリーンアップ
        ActionNotification.destroy();
    });

    describe('showMouseGestureHandler', () => {
        describe('事前条件の検証', () => {
            it('有効なGestureActionTypeが渡された場合、正常に処理される', () => {
                // Arrange
                const actionType = GestureActionType.GO_BACK;

                // Act & Assert（例外が発生しないことを確認）
                expect(() => {
                    ActionNotification.showMouseGestureHandler(actionType);
                }).not.toThrow();
            });

            it('nullが渡された場合、エラーが発生する', () => {
                // Arrange
                const actionType = null as any;

                // Act & Assert
                expect(() => {
                    ActionNotification.showMouseGestureHandler(actionType);
                }).toThrow('actionTypeは有効な文字列である必要があります');
            });

            it('undefinedが渡された場合、エラーが発生する', () => {
                // Arrange
                const actionType = undefined as any;

                // Act & Assert
                expect(() => {
                    ActionNotification.showMouseGestureHandler(actionType);
                }).toThrow('actionTypeは有効な文字列である必要があります');
            });

            it('空文字列が渡された場合、エラーが発生する', () => {
                // Arrange
                const actionType = '' as any;

                // Act & Assert
                expect(() => {
                    ActionNotification.showMouseGestureHandler(actionType);
                }).toThrow('actionTypeは有効な文字列である必要があります');
            });

            it('未対応のactionTypeが渡された場合、エラーが発生する', () => {
                // Arrange
                const actionType = 'invalidActionType' as any;

                // Act & Assert
                expect(() => {
                    ActionNotification.showMouseGestureHandler(actionType);
                }).toThrow('未対応のGestureActionType: invalidActionType');
            });
        });

        describe('事後条件の検証', () => {
            it('通知要素がDOMに追加される', () => {
                // Arrange
                const actionType = GestureActionType.GO_BACK;

                // Act
                ActionNotification.showMouseGestureHandler(actionType);

                // Assert
                const notificationElem = document.getElementById('smg-action-notification');
                expect(notificationElem).not.toBeNull();
                expect(notificationElem?.style.display).toBe('flex');
            });

            it('通知要素に正しいアクション名が表示される', () => {
                // Arrange
                const actionType = GestureActionType.GO_BACK;

                // Act
                ActionNotification.showMouseGestureHandler(actionType);

                // Assert
                const notificationElem = document.getElementById('smg-action-notification');
                expect(notificationElem?.textContent).toBe('戻る');
            });

            it('ログが正しく出力される', () => {
                // Arrange
                const actionType = GestureActionType.GO_BACK;

                // Act
                ActionNotification.showMouseGestureHandler(actionType);

                // Assert
                expect(Logger.debug).toHaveBeenCalledWith('アクション通知UIを表示', { actionName: '戻る' });
            });
        });
    });

    describe('showSuperDragActionHandler', () => {
        describe('事前条件の検証', () => {
            it('有効なSuperDragActionTypeが渡された場合、正常に処理される', () => {
                // Arrange
                const actionType = SuperDragActionType.SEARCH_GOOGLE;

                // Act & Assert（例外が発生しないことを確認）
                expect(() => {
                    ActionNotification.showSuperDragActionHandler(actionType);
                }).not.toThrow();
            });

            it('nullが渡された場合、エラーが発生する', () => {
                // Arrange
                const actionType = null as any;

                // Act & Assert
                expect(() => {
                    ActionNotification.showSuperDragActionHandler(actionType);
                }).toThrow('actionTypeは有効な文字列である必要があります');
            });

            it('undefinedが渡された場合、エラーが発生する', () => {
                // Arrange
                const actionType = undefined as any;

                // Act & Assert
                expect(() => {
                    ActionNotification.showSuperDragActionHandler(actionType);
                }).toThrow('actionTypeは有効な文字列である必要があります');
            });

            it('未対応のactionTypeが渡された場合、エラーが発生する', () => {
                // Arrange
                const actionType = 'invalidActionType' as any;

                // Act & Assert
                expect(() => {
                    ActionNotification.showSuperDragActionHandler(actionType);
                }).toThrow('未対応のSuperDragActionType: invalidActionType');
            });
        });

        describe('事後条件の検証', () => {
            it('通知要素がDOMに追加される', () => {
                // Arrange
                const actionType = SuperDragActionType.SEARCH_GOOGLE;

                // Act
                ActionNotification.showSuperDragActionHandler(actionType);

                // Assert
                const notificationElem = document.getElementById('smg-action-notification');
                expect(notificationElem).not.toBeNull();
                expect(notificationElem?.style.display).toBe('flex');
            });

            it('通知要素に正しいアクション名が表示される', () => {
                // Arrange
                const actionType = SuperDragActionType.SEARCH_GOOGLE;

                // Act
                ActionNotification.showSuperDragActionHandler(actionType);

                // Assert
                const notificationElem = document.getElementById('smg-action-notification');
                expect(notificationElem?.textContent).toBe('Googleで検索');
            });
        });
    });

    describe('hide', () => {
        describe('事前条件の検証', () => {
            it('通知要素が存在しない場合でも例外が発生しない', () => {
                // Act & Assert
                expect(() => {
                    ActionNotification.hide();
                }).not.toThrow();
            });
        });

        describe('事後条件の検証', () => {
            it('通知要素が非表示になる', () => {
                // Arrange
                ActionNotification.showMouseGestureHandler(GestureActionType.GO_BACK);

                // Act
                ActionNotification.hide();

                // Assert
                const notificationElem = document.getElementById('smg-action-notification');
                expect(notificationElem?.style.display).toBe('none');
            });

            it('lastActionNameがnullにリセットされる', () => {
                // Arrange
                ActionNotification.showMouseGestureHandler(GestureActionType.GO_BACK);

                // Act
                ActionNotification.hide();

                // Assert
                const lastActionName = (ActionNotification as any).lastActionName;
                expect(lastActionName).toBeNull();
            });

            it('ログが正しく出力される', () => {
                // Arrange
                ActionNotification.showMouseGestureHandler(GestureActionType.GO_BACK);
                jest.clearAllMocks();

                // Act
                ActionNotification.hide();

                // Assert
                expect(Logger.debug).toHaveBeenCalledWith('アクション通知UIを非表示');
            });
        });
    });

    describe('destroy', () => {
        describe('事前条件の検証', () => {
            it('通知要素が存在しない場合でも例外が発生しない', () => {
                // Act & Assert
                expect(() => {
                    ActionNotification.destroy();
                }).not.toThrow();
            });
        });

        describe('事後条件の検証', () => {
            it('通知要素がDOMから完全に削除される', () => {
                // Arrange
                ActionNotification.showMouseGestureHandler(GestureActionType.GO_BACK);

                // Act
                ActionNotification.destroy();

                // Assert
                const notificationElem = document.getElementById('smg-action-notification');
                expect(notificationElem).toBeNull();
            });

            it('notificationElemがnullにリセットされる', () => {
                // Arrange
                ActionNotification.showMouseGestureHandler(GestureActionType.GO_BACK);

                // Act
                ActionNotification.destroy();

                // Assert
                const notificationElem = (ActionNotification as any).notificationElem;
                expect(notificationElem).toBeNull();
            });

            it('lastActionNameがnullにリセットされる', () => {
                // Arrange
                ActionNotification.showMouseGestureHandler(GestureActionType.GO_BACK);

                // Act
                ActionNotification.destroy();

                // Assert
                const lastActionName = (ActionNotification as any).lastActionName;
                expect(lastActionName).toBeNull();
            });

            it('ログが正しく出力される', () => {
                // Arrange
                ActionNotification.showMouseGestureHandler(GestureActionType.GO_BACK);
                jest.clearAllMocks();

                // Act
                ActionNotification.destroy();

                // Assert
                expect(Logger.debug).toHaveBeenCalledWith('アクション通知UIをDOMから削除');
            });
        });
    });

    describe('不変条件の検証', () => {
        it('通知要素のIDは常に"smg-action-notification"である', () => {
            // Arrange & Act
            ActionNotification.showMouseGestureHandler(GestureActionType.GO_BACK);

            // Assert
            const notificationElem = document.getElementById('smg-action-notification');
            expect(notificationElem?.id).toBe('smg-action-notification');
        });

        it('通知要素は常に画面中央に配置される', () => {
            // Arrange & Act
            ActionNotification.showMouseGestureHandler(GestureActionType.GO_BACK);

            // Assert
            const notificationElem = document.getElementById('smg-action-notification');
            expect(notificationElem?.style.position).toBe('fixed');
            expect(notificationElem?.style.top).toBe('50%');
            expect(notificationElem?.style.left).toBe('50%');
            expect(notificationElem?.style.transform).toBe('translate(-50%, -50%)');
        });

        it('通知要素は常に最前面に表示される', () => {
            // Arrange & Act
            ActionNotification.showMouseGestureHandler(GestureActionType.GO_BACK);

            // Assert
            const notificationElem = document.getElementById('smg-action-notification');
            expect(notificationElem?.style.zIndex).toBe('999999');
        });

        it('通知要素はマウスイベントを受け取らない', () => {
            // Arrange & Act
            ActionNotification.showMouseGestureHandler(GestureActionType.GO_BACK);

            // Assert
            const notificationElem = document.getElementById('smg-action-notification');
            expect(notificationElem?.style.pointerEvents).toBe('none');
        });

        it('同一のアクション名を連続で表示する場合、要素は再利用される', () => {
            // Arrange
            ActionNotification.showMouseGestureHandler(GestureActionType.GO_BACK);
            const firstElem = document.getElementById('smg-action-notification');

            // Act
            ActionNotification.showMouseGestureHandler(GestureActionType.GO_BACK);
            const secondElem = document.getElementById('smg-action-notification');

            // Assert
            expect(firstElem).toBe(secondElem);
        });

        it('異なるアクション名を表示する場合、要素は再利用されるが内容が更新される', () => {
            // Arrange
            ActionNotification.showMouseGestureHandler(GestureActionType.GO_BACK);
            const elem = document.getElementById('smg-action-notification');
            expect(elem?.textContent).toBe('戻る');

            // Act
            ActionNotification.showMouseGestureHandler(GestureActionType.FORWARD);

            // Assert
            const sameElem = document.getElementById('smg-action-notification');
            expect(elem).toBe(sameElem);
            expect(sameElem?.textContent).toBe('進む');
        });
    });

    describe('例外処理の検証', () => {
        it('DOM操作でエラーが発生した場合、エラーログが出力される', () => {
            // Arrange
            const originalCreateElement = document.createElement;
            document.createElement = jest.fn().mockImplementation(() => {
                throw new Error('DOM操作エラー');
            });

            // Act
            ActionNotification.showMouseGestureHandler(GestureActionType.GO_BACK);

            // Assert
            expect(Logger.error).toHaveBeenCalledWith('アクション通知UIの表示に失敗', { 
                error: 'DOM操作エラー' 
            });

            // Cleanup
            document.createElement = originalCreateElement;
        });

        it('hide処理でエラーが発生した場合、エラーログが出力される', () => {
            // Arrange
            ActionNotification.showMouseGestureHandler(GestureActionType.GO_BACK);
            const notificationElem = (ActionNotification as any).notificationElem;
            
            // styleプロパティにアクセスするとエラーが発生するようにモック
            Object.defineProperty(notificationElem, 'style', {
                get: () => {
                    throw new Error('スタイル操作エラー');
                }
            });

            // Act
            ActionNotification.hide();

            // Assert
            expect(Logger.error).toHaveBeenCalledWith('アクション通知UIの非表示に失敗', { 
                error: 'スタイル操作エラー' 
            });
        });

        it('destroy処理でエラーが発生した場合、エラーログが出力される', () => {
            // Arrange
            ActionNotification.showMouseGestureHandler(GestureActionType.GO_BACK);
            const notificationElem = (ActionNotification as any).notificationElem;
            
            // parentNodeプロパティにアクセスするとエラーが発生するようにモック
            Object.defineProperty(notificationElem, 'parentNode', {
                get: () => {
                    throw new Error('DOM削除エラー');
                }
            });

            // Act
            ActionNotification.destroy();

            // Assert
            expect(Logger.error).toHaveBeenCalledWith('アクション通知UIのDOM削除に失敗', { 
                error: 'DOM削除エラー' 
            });
        });
    });
}); 