import { SuperDragHandler } from '../../../src/content/handlers/super_drag_handler';
import { SuperDragSettingsService } from '../../../src/content/services/super_drag_action/settings/super_drag_settings_service';
import { Direction } from '../../../src/content/models/direction';
import { DragType } from '../../../src/content/models/drag_type';
import { DragContext } from '../../../src/content/handlers/drag_context';
import { SuperDragActionFactory } from '../../../src/content/services/super_drag_action/super_drag_action_factory';
import { ActionNotification } from '../../../src/content/handlers/action_notification';
import { ContentContainerProvider } from '../../../src/content/provider/content_container_provider';
import Logger from '../../../src/common/logger/logger';
import { SuperDragActionType } from '../../../src/content/services/super_drag_action/super_drag_action_type';
import { SuperDragSettings } from '../../../src/common/constants/super_drag_settings';

// モック設定
jest.mock('../../../src/common/logger/logger');
jest.mock('../../../src/content/services/super_drag_action/super_drag_action_factory');
jest.mock('../../../src/content/handlers/action_notification');
jest.mock('../../../src/content/provider/content_container_provider');
jest.mock('../../../src/content/handlers/drag_context');

// DragEventのモック（Node.js環境では定義されていないため）
global.DragEvent = class DragEvent extends Event {
    clientX: number;
    clientY: number;
    
    constructor(type: string, eventInitDict?: { clientX?: number; clientY?: number }) {
        super(type);
        this.clientX = eventInitDict?.clientX || 0;
        this.clientY = eventInitDict?.clientY || 0;
    }
} as any;

describe('SuperDragHandler', () => {
    let handler: SuperDragHandler;
    let mockSettingsService: jest.Mocked<SuperDragSettingsService>;
    let mockAction: any;
    let mockContainer: any;

    // ヘルパー関数：完全なSuperDragSettingsオブジェクトを生成
    const createMockSettings = (overrides: Partial<SuperDragSettings> = {}): SuperDragSettings => {
        const defaultSettings: SuperDragSettings = {
            [DragType.TEXT]: {
                [Direction.RIGHT]: { action: '', params: {} },
                [Direction.LEFT]: { action: '', params: {} },
                [Direction.UP]: { action: '', params: {} },
                [Direction.DOWN]: { action: '', params: {} },
                [Direction.NONE]: { action: '', params: {} }
            },
            [DragType.LINK]: {
                [Direction.RIGHT]: { action: '', params: {} },
                [Direction.LEFT]: { action: '', params: {} },
                [Direction.UP]: { action: '', params: {} },
                [Direction.DOWN]: { action: '', params: {} },
                [Direction.NONE]: { action: '', params: {} }
            },
            [DragType.IMAGE]: {
                [Direction.RIGHT]: { action: '', params: {} },
                [Direction.LEFT]: { action: '', params: {} },
                [Direction.UP]: { action: '', params: {} },
                [Direction.DOWN]: { action: '', params: {} },
                [Direction.NONE]: { action: '', params: {} }
            },
            [DragType.NONE]: {
                [Direction.RIGHT]: { action: '', params: {} },
                [Direction.LEFT]: { action: '', params: {} },
                [Direction.UP]: { action: '', params: {} },
                [Direction.DOWN]: { action: '', params: {} },
                [Direction.NONE]: { action: '', params: {} }
            }
        };
        
        return { ...defaultSettings, ...overrides };
    };

         beforeEach(() => {
         // モックの初期化
         mockSettingsService = {
             getSettings: jest.fn().mockResolvedValue(createMockSettings()),
         } as any;

         mockAction = {
             execute: jest.fn(),
         };

         mockContainer = {
             get: jest.fn(),
         };

         // ファクトリとプロバイダのモック設定
         (SuperDragActionFactory.create as jest.Mock).mockReturnValue(mockAction);
         (ContentContainerProvider.prototype.getContainer as jest.Mock).mockReturnValue(mockContainer);

         // ActionNotificationのモック設定
         (ActionNotification.hide as jest.Mock).mockImplementation(() => {});
         (ActionNotification.showSuperDragActionHandler as jest.Mock).mockImplementation(() => {});
         (ActionNotification.destroy as jest.Mock).mockImplementation(() => {});

         // DragContextのモック設定
         (DragContext.create as jest.Mock).mockReturnValue({
             dragType: DragType.TEXT,
             selectedValue: 'test',
             isValid: jest.fn().mockReturnValue(true)
         });
         (DragContext.default as jest.Mock).mockReturnValue({
             dragType: DragType.NONE,
             selectedValue: '',
             isValid: jest.fn().mockReturnValue(false)
         });

         handler = new SuperDragHandler(mockSettingsService);
     });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('コンストラクタ', () => {
        describe('事前条件', () => {
            it('SuperDragSettingsServiceが提供されること', () => {
                expect(() => new SuperDragHandler(mockSettingsService)).not.toThrow();
            });

            it('nullのSuperDragSettingsServiceでもインスタンス化できること', () => {
                expect(() => new SuperDragHandler(null as any)).not.toThrow();
            });
        });

        describe('事後条件', () => {
                         it('初期状態でdragStartPosがPoint.NONEであること', () => {
                 const newHandler = new SuperDragHandler(mockSettingsService);
                 // プライベートフィールドのため、動作で検証
                 // 初期状態でisNotDragがtrueであることを確認
                 const dragEvent = new DragEvent('drag', { clientX: 150, clientY: 150 });
                 expect(() => newHandler.onDrag(dragEvent)).not.toThrow();
             });

            it('初期状態でdragContextがデフォルト値であること', () => {
                const handler = new SuperDragHandler(mockSettingsService);
                // プライベートフィールドのため、動作で検証
                const dragEvent = new DragEvent('drag', { clientX: 100, clientY: 100 });
                expect(() => handler.onDrag(dragEvent)).not.toThrow();
            });
        });
    });

    describe('onMouseDown', () => {
        describe('事前条件', () => {
            it('MouseEventが提供されること', () => {
                const mouseEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
                expect(() => handler.onMouseDown(mouseEvent)).not.toThrow();
            });

                         it('nullのMouseEventでエラーが発生すること', () => {
                 expect(() => handler.onMouseDown(null as any)).toThrow();
             });
        });

        describe('事後条件', () => {
            it('有効なドラッグコンテキストの場合、ドラッグ開始位置が設定されること', () => {
                const mouseEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
                (DragContext.create as jest.Mock).mockReturnValue({
                    dragType: DragType.TEXT,
                    selectedValue: 'test',
                    isValid: jest.fn().mockReturnValue(true)
                });
                
                handler.onMouseDown(mouseEvent);
                
                expect(DragContext.create).toHaveBeenCalledWith(mouseEvent);
                expect(Logger.debug).toHaveBeenCalledWith(
                    'スーパードラッグの要素を選択',
                    expect.objectContaining({
                        x: 100,
                        y: 100
                    })
                );
            });

            it('方向履歴と無効化フラグがリセットされること', () => {
                const mouseEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
                (DragContext.create as jest.Mock).mockReturnValue({
                    dragType: DragType.TEXT,
                    selectedValue: 'test',
                    isValid: jest.fn().mockReturnValue(true)
                });
                
                handler.onMouseDown(mouseEvent);
                
                // 内部状態のリセットが正常に行われることを間接的に検証
                // 後続のドラッグ処理で正常に動作することで確認
                expect(DragContext.create).toHaveBeenCalledWith(mouseEvent);
            });

            it('無効なドラッグコンテキストの場合、処理が早期終了すること', () => {
                const newHandler = new SuperDragHandler(mockSettingsService);
                const mouseEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
                
                // モックを完全にリセットしてから設定
                (DragContext.create as jest.Mock).mockReset();
                const mockDragContext = {
                    dragType: DragType.NONE,
                    selectedValue: '',
                    isValid: jest.fn().mockReturnValue(false)
                };
                (DragContext.create as jest.Mock).mockReturnValue(mockDragContext);
                
                // Loggerのモックをクリア
                (Logger.debug as jest.Mock).mockClear();
                
                newHandler.onMouseDown(mouseEvent);
                
                // DragContext.createが呼ばれることを確認
                expect(DragContext.create).toHaveBeenCalledWith(mouseEvent);
                
                                // DragType.NONEの場合は早期returnするため、ログは出力されない
                expect(Logger.debug).not.toHaveBeenCalled();
            });
        });

        describe('不変条件', () => {
            it('メソッド実行後もhandlerインスタンスが有効であること', () => {
                const mouseEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
                handler.onMouseDown(mouseEvent);
                
                expect(handler).toBeDefined();
                expect(typeof handler.onDrag).toBe('function');
                expect(typeof handler.onDragEnd).toBe('function');
            });
        });
    });

    describe('onDragStart', () => {
        describe('事前条件', () => {
            it('DragEventが提供されること', () => {
                const dragEvent = new DragEvent('dragstart', { clientX: 100, clientY: 100 });
                expect(() => handler.onDragStart(dragEvent)).not.toThrow();
            });
        });

        describe('事後条件', () => {
            it('ドラッグが有効な場合、デバッグログが出力されること', () => {
                // 事前にマウスダウンでドラッグを開始
                const mouseEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
                (DragContext.create as jest.Mock).mockReturnValue({
                    dragType: DragType.TEXT,
                    selectedValue: 'test',
                    isValid: jest.fn().mockReturnValue(true)
                });
                handler.onMouseDown(mouseEvent);
                
                const dragEvent = new DragEvent('dragstart', { clientX: 100, clientY: 100 });
                handler.onDragStart(dragEvent);
                
                expect(Logger.debug).toHaveBeenCalledWith(
                    'ドラッグ開始',
                    expect.objectContaining({
                        x: 100,
                        y: 100
                    })
                );
            });

                                     it('ドラッグが無効な場合、早期終了すること', () => {
                // 新しいhandlerインスタンスを作成（ドラッグが開始されていない状態）
                const newHandler = new SuperDragHandler(mockSettingsService);
                
                (Logger.debug as jest.Mock).mockClear();
                
                const dragEvent = new DragEvent('dragstart', { clientX: 100, clientY: 100 });
                newHandler.onDragStart(dragEvent);
                
                // ドラッグが開始されていないため（dragContext.dragType === DragType.NONE）、ログは出力されない
                expect(Logger.debug).not.toHaveBeenCalled();
            });
        });
    });

    describe('onDrag', () => {
        beforeEach(() => {
            // ドラッグを開始状態にする
            const mouseEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
            (DragContext.create as jest.Mock).mockReturnValue({
                dragType: DragType.TEXT,
                selectedValue: 'test',
                isValid: jest.fn().mockReturnValue(true)
            });
            handler.onMouseDown(mouseEvent);
        });

                 describe('事前条件', () => {
             it('DragEventが提供されること', () => {
                 const dragEvent = new DragEvent('drag', { clientX: 150, clientY: 150 });
                 expect(() => handler.onDrag(dragEvent)).not.toThrow();
             });
         });

        describe('事後条件', () => {
            it('方向がNONEの場合、ActionNotificationが非表示になること', () => {
                // 閾値以下の移動でDirection.NONEになるケース
                const dragEvent = new DragEvent('drag', { clientX: 110, clientY: 110 });
                handler.onDrag(dragEvent);
                
                expect(ActionNotification.hide).toHaveBeenCalled();
            });

                                      it('有効な方向の場合、設定を取得してアクション名を表示すること', async () => {
                 const mockSettings = createMockSettings({
                     [DragType.TEXT]: {
                         [Direction.RIGHT]: {
                             action: 'searchGoogle',
                             params: {}
                         },
                         [Direction.LEFT]: { action: '', params: {} },
                         [Direction.UP]: { action: '', params: {} },
                         [Direction.DOWN]: { action: '', params: {} },
                         [Direction.NONE]: { action: '', params: {} }
                     }
                 });
                 
                 // モックをクリアしてから設定
                 mockSettingsService.getSettings.mockClear();
                 mockSettingsService.getSettings.mockResolvedValue(mockSettings);
                 
                 const dragEvent = new DragEvent('drag', { clientX: 200, clientY: 100 });
                 handler.onDrag(dragEvent);
                 
                 // 非同期処理のため、少し待つ
                 await new Promise(resolve => setTimeout(resolve, 10));
                 
                 expect(mockSettingsService.getSettings).toHaveBeenCalled();
                 expect(ActionNotification.showSuperDragActionHandler).toHaveBeenCalledWith(
                     'searchGoogle'
                 );
             });

                         it('アクション名が空の場合、ActionNotificationが非表示になること', async () => {
                 const mockSettings = createMockSettings({
                     [DragType.TEXT]: {
                         [Direction.RIGHT]: {
                             action: '',
                             params: {}
                         },
                         [Direction.LEFT]: { action: '', params: {} },
                         [Direction.UP]: { action: '', params: {} },
                         [Direction.DOWN]: { action: '', params: {} },
                         [Direction.NONE]: { action: '', params: {} }
                     }
                 });
                 mockSettingsService.getSettings.mockResolvedValue(mockSettings);
                
                const dragEvent = new DragEvent('drag', { clientX: 200, clientY: 100 });
                handler.onDrag(dragEvent);
                
                await new Promise(resolve => setTimeout(resolve, 0));
                
                expect(ActionNotification.hide).toHaveBeenCalled();
            });

            it('同一方向への連続移動では方向履歴が重複追加されないこと', async () => {
                const mockSettings = createMockSettings({
                    [DragType.TEXT]: {
                        [Direction.RIGHT]: {
                            action: 'searchGoogle',
                            params: {}
                        },
                        [Direction.LEFT]: { action: '', params: {} },
                        [Direction.UP]: { action: '', params: {} },
                        [Direction.DOWN]: { action: '', params: {} },
                        [Direction.NONE]: { action: '', params: {} }
                    }
                });
                mockSettingsService.getSettings.mockResolvedValue(mockSettings);
                
                // 同一方向（RIGHT）への複数回の移動
                const dragEvent1 = new DragEvent('drag', { clientX: 150, clientY: 100 });
                const dragEvent2 = new DragEvent('drag', { clientX: 200, clientY: 100 });
                const dragEvent3 = new DragEvent('drag', { clientX: 250, clientY: 100 });
                
                handler.onDrag(dragEvent1);
                await new Promise(resolve => setTimeout(resolve, 10));
                handler.onDrag(dragEvent2);
                await new Promise(resolve => setTimeout(resolve, 10));
                handler.onDrag(dragEvent3);
                await new Promise(resolve => setTimeout(resolve, 10));
                
                // アクションが正常に表示されることを確認（無効化されていない）
                expect(ActionNotification.showSuperDragActionHandler).toHaveBeenCalledWith('searchGoogle');
            });

            it('2方向目の移動を検出した場合、アクションが無効化されること', async () => {
                const mockSettings = createMockSettings({
                    [DragType.TEXT]: {
                        [Direction.RIGHT]: {
                            action: 'searchGoogle',
                            params: {}
                        },
                        [Direction.UP]: {
                            action: 'searchBing',
                            params: {}
                        },
                        [Direction.LEFT]: { action: '', params: {} },
                        [Direction.DOWN]: { action: '', params: {} },
                        [Direction.NONE]: { action: '', params: {} }
                    }
                });
                mockSettingsService.getSettings.mockResolvedValue(mockSettings);
                
                // Loggerのモックをクリア
                (Logger.debug as jest.Mock).mockClear();
                
                // 1方向目の移動（RIGHT）- 開始点(100,100)から(150,100)へ、dx=50>30なのでRIGHT
                const dragEvent1 = new DragEvent('drag', { clientX: 150, clientY: 100 });
                handler.onDrag(dragEvent1);
                await new Promise(resolve => setTimeout(resolve, 10));
                
                // 2方向目の移動（UP）- 開始点(100,100)から(100,50)へ、dx=0, dy=-50<-30なのでUP
                const dragEvent2 = new DragEvent('drag', { clientX: 100, clientY: 50 });
                handler.onDrag(dragEvent2);
                await new Promise(resolve => setTimeout(resolve, 10));
                
                // 2方向目の移動後は無効化ログが出力されるべき
                expect(Logger.debug).toHaveBeenCalledWith(
                    '2方向目の移動を検出',
                    expect.objectContaining({
                        directions: expect.arrayContaining([Direction.RIGHT, Direction.UP]),
                        currentDirection: Direction.UP
                    })
                );
            });

            it('3方向目の移動を検出した場合、NONEアクションが継続表示されること', async () => {
                const mockSettings = createMockSettings({
                    [DragType.TEXT]: {
                        [Direction.RIGHT]: {
                            action: 'searchGoogle',
                            params: {}
                        },
                        [Direction.UP]: {
                            action: 'searchBing',
                            params: {}
                        },
                        [Direction.LEFT]: {
                            action: 'copyText',
                            params: {}
                        },
                        [Direction.DOWN]: { action: '', params: {} },
                        [Direction.NONE]: { action: '', params: {} }
                    }
                });
                mockSettingsService.getSettings.mockResolvedValue(mockSettings);
                
                // ActionNotificationのモックをクリア
                (ActionNotification.showSuperDragActionHandler as jest.Mock).mockClear();
                
                // 1方向目の移動（RIGHT）- 開始点(100,100)から(150,100)へ
                const dragEvent1 = new DragEvent('drag', { clientX: 150, clientY: 100 });
                handler.onDrag(dragEvent1);
                await new Promise(resolve => setTimeout(resolve, 10));
                
                // 2方向目の移動（UP）でアクション無効化 - 開始点(100,100)から(100,50)へ
                const dragEvent2 = new DragEvent('drag', { clientX: 100, clientY: 50 });
                handler.onDrag(dragEvent2);
                await new Promise(resolve => setTimeout(resolve, 10));
                
                // 3方向目の移動（LEFT）- この時点で無効化されているのでNONEが表示される
                const dragEvent3 = new DragEvent('drag', { clientX: 60, clientY: 100 });
                handler.onDrag(dragEvent3);
                await new Promise(resolve => setTimeout(resolve, 10));
                
                // NONEアクションが表示されることを確認
                expect(ActionNotification.showSuperDragActionHandler).toHaveBeenCalledWith(SuperDragActionType.NONE);
            });
        });

        describe('不変条件', () => {
                         it('ドラッグが無効な場合、状態が変更されないこと', () => {
                 // ドラッグを無効状態にする
                 const newHandler = new SuperDragHandler(mockSettingsService);
                 
                 const dragEvent = new DragEvent('drag', { clientX: 150, clientY: 150 });
                 newHandler.onDrag(dragEvent);
                 
                 expect(mockSettingsService.getSettings).not.toHaveBeenCalled();
                 expect(ActionNotification.showSuperDragActionHandler).not.toHaveBeenCalled();
             });
        });
    });

    describe('onDragEnd', () => {
        beforeEach(() => {
            // ドラッグを開始状態にする
            const mouseEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
            (DragContext.create as jest.Mock).mockReturnValue({
                dragType: DragType.TEXT,
                selectedValue: 'test',
                isValid: jest.fn().mockReturnValue(true)
            });
            handler.onMouseDown(mouseEvent);
        });

        describe('事前条件', () => {
            it('DragEventが提供されること', () => {
                const dragEvent = new DragEvent('dragend', { clientX: 200, clientY: 100 });
                expect(() => handler.onDragEnd(dragEvent)).not.toThrow();
            });
        });

        describe('事後条件', () => {
            it('方向がNONEの場合、アクションが実行されないこと', async () => {
                const dragEvent = new DragEvent('dragend', { clientX: 110, clientY: 110 });
                await handler.onDragEnd(dragEvent);
                
                expect(mockSettingsService.getSettings).not.toHaveBeenCalled();
                expect(mockAction.execute).not.toHaveBeenCalled();
            });

                         it('有効な方向の場合、アクションが実行されること', async () => {
                 const mockSettings = createMockSettings({
                     [DragType.TEXT]: {
                         [Direction.RIGHT]: {
                             action: 'searchGoogle',
                             params: { query: 'test' }
                         },
                         [Direction.LEFT]: { action: '', params: {} },
                         [Direction.UP]: { action: '', params: {} },
                         [Direction.DOWN]: { action: '', params: {} },
                         [Direction.NONE]: { action: '', params: {} }
                     }
                 });
                 
                 // モックをクリアしてから設定
                 mockSettingsService.getSettings.mockClear();
                 mockSettingsService.getSettings.mockResolvedValue(mockSettings);
                
                const dragEvent = new DragEvent('dragend', { clientX: 200, clientY: 100 });
                await handler.onDragEnd(dragEvent);
                
                expect(mockSettingsService.getSettings).toHaveBeenCalled();
                expect(SuperDragActionFactory.create).toHaveBeenCalledWith(
                    'searchGoogle',
                    expect.any(Object)
                );
                expect(mockAction.execute).toHaveBeenCalledWith({
                    type: DragType.TEXT,
                    direction: Direction.RIGHT,
                    actionName: 'searchGoogle',
                    params: { query: 'test' },
                    selectedValue: 'test'
                });
            });

                         it('アクション実行後、状態がリセットされること', async () => {
                 const mockSettings = createMockSettings({
                     [DragType.TEXT]: {
                         [Direction.RIGHT]: {
                             action: 'searchGoogle',
                             params: {}
                         },
                         [Direction.LEFT]: { action: '', params: {} },
                         [Direction.UP]: { action: '', params: {} },
                         [Direction.DOWN]: { action: '', params: {} },
                         [Direction.NONE]: { action: '', params: {} }
                     }
                 });
                 mockSettingsService.getSettings.mockResolvedValue(mockSettings);
                 
                 const dragEvent = new DragEvent('dragend', { clientX: 200, clientY: 100 });
                 await handler.onDragEnd(dragEvent);
                 
                 expect(ActionNotification.hide).toHaveBeenCalled();
                 expect(DragContext.default).toHaveBeenCalled();
             });

            it('ドラッグ終了時に方向履歴と無効化フラグがリセットされること', async () => {
                const mockSettings = createMockSettings({
                    [DragType.TEXT]: {
                        [Direction.RIGHT]: {
                            action: 'searchGoogle',
                            params: {}
                        },
                        [Direction.LEFT]: { action: '', params: {} },
                        [Direction.UP]: { action: '', params: {} },
                        [Direction.DOWN]: { action: '', params: {} },
                        [Direction.NONE]: { action: '', params: {} }
                    }
                });
                mockSettingsService.getSettings.mockResolvedValue(mockSettings);
                
                const dragEvent = new DragEvent('dragend', { clientX: 200, clientY: 100 });
                await handler.onDragEnd(dragEvent);
                
                // 方向履歴と無効化フラグがリセットされることを確認
                expect(Logger.debug).toHaveBeenCalledWith(
                    'ドラッグ終了',
                    expect.objectContaining({
                        context: expect.any(Object),
                        direction: Direction.RIGHT,
                        directionHistory: expect.any(Array),
                        isActionDisabled: expect.any(Boolean)
                    })
                );
            });

            it('アクションが無効化後にドラッグ終了した場合はアクションが実行されないこと', async () => {
                const mockSettings = createMockSettings({
                    [DragType.TEXT]: {
                        [Direction.RIGHT]: {
                            action: 'searchGoogle',
                            params: {}
                        },
                        [Direction.UP]: { action: '', params: {} },
                        [Direction.LEFT]: { action: '', params: {} },
                        [Direction.DOWN]: { action: '', params: {} },
                        [Direction.NONE]: { action: '', params: {} }
                    }
                });
                mockSettingsService.getSettings.mockResolvedValue(mockSettings);
                
                // マウスダウンイベントでドラッグ開始位置を設定
                const mouseDownEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
                handler.onMouseDown(mouseDownEvent);
                
                // 2方向の移動でアクション表示を無効化
                // 1回目：RIGHT方向に移動
                const dragEvent1 = new DragEvent('drag', { clientX: 150, clientY: 100 });
                handler.onDrag(dragEvent1);
                await new Promise(resolve => setTimeout(resolve, 10));
                
                // 2回目：UP方向に移動（開始点から見てUPになるよう座標調整）
                const dragEvent2 = new DragEvent('drag', { clientX: 100, clientY: 50 });
                handler.onDrag(dragEvent2);
                await new Promise(resolve => setTimeout(resolve, 10));
                
                // ドラッグ終了（UP方向で終了） - 最終的な方向は開始点からの方向で決まる
                const dragEndEvent = new DragEvent('dragend', { clientX: 100, clientY: 50 });
                await handler.onDragEnd(dragEndEvent);
                
                // アクションが無効化されているため、アクションは実行されない
                expect(mockAction.execute).not.toHaveBeenCalled();
                
                // 無効化のログが出力されることを確認
                expect(Logger.debug).toHaveBeenCalledWith(
                    'アクションが無効化されているため実行をスキップ',
                    expect.objectContaining({
                        direction: Direction.UP,
                        directionHistory: expect.any(Array)
                    })
                );
            });

             it('例外が発生した場合、警告ログが出力され状態がリセットされること', async () => {
                 mockSettingsService.getSettings.mockRejectedValue(new Error('設定取得エラー'));
                 
                 const dragEvent = new DragEvent('dragend', { clientX: 200, clientY: 100 });
                 await handler.onDragEnd(dragEvent);
                 
                 expect(Logger.warn).toHaveBeenCalledWith(
                     '未対応のスーパードラッグアクション',
                     expect.any(Object)
                 );
                 expect(ActionNotification.hide).toHaveBeenCalled();
                 expect(DragContext.default).toHaveBeenCalled();
             });
        });

        describe('不変条件', () => {
            it('メソッド実行後、必ず状態がリセットされること', async () => {
                const dragEvent = new DragEvent('dragend', { clientX: 200, clientY: 100 });
                await handler.onDragEnd(dragEvent);
                
                // 状態リセットの確認
                expect(ActionNotification.hide).toHaveBeenCalled();
                expect(DragContext.default).toHaveBeenCalled();
            });

            it('例外発生時でも必ず状態がリセットされること', async () => {
                mockSettingsService.getSettings.mockRejectedValue(new Error('テストエラー'));
                
                const dragEvent = new DragEvent('dragend', { clientX: 200, clientY: 100 });
                await handler.onDragEnd(dragEvent);
                
                expect(ActionNotification.hide).toHaveBeenCalled();
                expect(DragContext.default).toHaveBeenCalled();
            });
        });
    });

    describe('destroy', () => {
        describe('事前条件', () => {
            it('引数なしで呼び出せること', () => {
                expect(() => handler.destroy()).not.toThrow();
            });
        });

        describe('事後条件', () => {
            it('ActionNotificationが破棄されること', () => {
                handler.destroy();
                
                expect(ActionNotification.destroy).toHaveBeenCalled();
            });

            it('デバッグログが出力されること', () => {
                handler.destroy();
                
                expect(Logger.debug).toHaveBeenCalledWith('SuperDragHandler インスタンス破棄');
            });
        });

        describe('不変条件', () => {
            it('複数回呼び出してもエラーが発生しないこと', () => {
                expect(() => {
                    handler.destroy();
                    handler.destroy();
                    handler.destroy();
                }).not.toThrow();
            });
        });
    });

    describe('isNotDrag (プライベートメソッドの動作検証)', () => {
        describe('不変条件', () => {
                         it('DragType.NONEの場合、ドラッグ処理が実行されないこと', () => {
                 // DragType.NONEの状態でドラッグイベントを発生
                 const newHandler = new SuperDragHandler(mockSettingsService);
                 
                 const dragEvent = new DragEvent('drag', { clientX: 150, clientY: 150 });
                 newHandler.onDrag(dragEvent);
                 
                 // ドラッグが無効なため、設定取得やアクション表示は行われない
                 expect(mockSettingsService.getSettings).not.toHaveBeenCalled();
                 expect(ActionNotification.showSuperDragActionHandler).not.toHaveBeenCalled();
             });

                         it('有効なDragTypeの場合、ドラッグ処理が実行されること', async () => {
                 // 有効なDragTypeでドラッグを開始
                 (DragContext.create as jest.Mock).mockReturnValue({
                     dragType: DragType.TEXT,
                     selectedValue: 'test',
                     isValid: jest.fn().mockReturnValue(true)
                 });
                 const mouseEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
                 handler.onMouseDown(mouseEvent);
                 
                 const mockSettings = createMockSettings({
                     [DragType.TEXT]: {
                         [Direction.RIGHT]: {
                             action: 'searchGoogle',
                             params: {}
                         },
                         [Direction.LEFT]: { action: '', params: {} },
                         [Direction.UP]: { action: '', params: {} },
                         [Direction.DOWN]: { action: '', params: {} },
                         [Direction.NONE]: { action: '', params: {} }
                     }
                 });
                 mockSettingsService.getSettings.mockResolvedValue(mockSettings);
                 
                 const dragEvent = new DragEvent('drag', { clientX: 200, clientY: 100 });
                 handler.onDrag(dragEvent);
                 
                 await new Promise(resolve => setTimeout(resolve, 0));
                 
                 expect(mockSettingsService.getSettings).toHaveBeenCalled();
             });
        });
    });

    describe('境界値テスト', () => {
        beforeEach(() => {
            const mouseEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
            (DragContext.create as jest.Mock).mockReturnValue({
                dragType: DragType.TEXT,
                selectedValue: 'test',
                isValid: jest.fn().mockReturnValue(true)
            });
            handler.onMouseDown(mouseEvent);
        });

        it('閾値ちょうどの移動でDirection.NONEになること', () => {
            // Point.THRESHOLDは30なので、29ピクセルの移動
            const dragEvent = new DragEvent('drag', { clientX: 129, clientY: 100 });
            handler.onDrag(dragEvent);
            
            expect(ActionNotification.hide).toHaveBeenCalled();
        });

                 it('閾値を超える移動で有効な方向が検出されること', async () => {
             const mockSettings = createMockSettings({
                 [DragType.TEXT]: {
                     [Direction.RIGHT]: {
                         action: 'searchGoogle',
                         params: {}
                     },
                     [Direction.LEFT]: { action: '', params: {} },
                     [Direction.UP]: { action: '', params: {} },
                     [Direction.DOWN]: { action: '', params: {} },
                     [Direction.NONE]: { action: '', params: {} }
                 }
             });
             
             // モックをクリアしてから設定
             mockSettingsService.getSettings.mockClear();
             mockSettingsService.getSettings.mockResolvedValue(mockSettings);
             
             // 31ピクセルの移動（閾値30を超える）
             const dragEvent = new DragEvent('drag', { clientX: 131, clientY: 100 });
             handler.onDrag(dragEvent);
             
             await new Promise(resolve => setTimeout(resolve, 10));
             
             expect(ActionNotification.showSuperDragActionHandler).toHaveBeenCalledWith(
                 'searchGoogle'
             );
         });
     });

     describe('異常系テスト', () => {
         it('設定が未定義の場合でもエラーが発生しないこと', async () => {
             mockSettingsService.getSettings.mockResolvedValue(null as any);
             
             const mouseEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
             (DragContext.create as jest.Mock).mockReturnValue({
                 dragType: DragType.TEXT,
                 selectedValue: 'test',
                 isValid: jest.fn().mockReturnValue(true)
             });
             handler.onMouseDown(mouseEvent);
             
             const dragEvent = new DragEvent('dragend', { clientX: 200, clientY: 100 });
             await expect(handler.onDragEnd(dragEvent)).resolves.not.toThrow();
         });

         it('設定のアクション設定が未定義の場合でもエラーが発生しないこと', async () => {
             const mockSettings = createMockSettings({
                 [DragType.TEXT]: {
                     [Direction.RIGHT]: { action: '', params: {} },
                     [Direction.LEFT]: { action: '', params: {} },
                     [Direction.UP]: { action: '', params: {} },
                     [Direction.DOWN]: { action: '', params: {} },
                     [Direction.NONE]: { action: '', params: {} }
                 }
             });
             mockSettingsService.getSettings.mockResolvedValue(mockSettings);
             
             const mouseEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
             (DragContext.create as jest.Mock).mockReturnValue({
                 dragType: DragType.TEXT,
                 selectedValue: 'test',
                 isValid: jest.fn().mockReturnValue(true)
             });
             handler.onMouseDown(mouseEvent);
             
             const dragEvent = new DragEvent('dragend', { clientX: 200, clientY: 100 });
             await expect(handler.onDragEnd(dragEvent)).resolves.not.toThrow();
         });
    });
});
