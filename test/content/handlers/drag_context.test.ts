import { DragContext } from '../../../src/content/handlers/drag_context';
import { DragType } from '../../../src/content/models/drag_type';

describe('DragContext', () => {
    describe('コンストラクタ', () => {
        describe('不変条件の検証', () => {
            test('dragTypeとselectedValueが正しく設定される', () => {
                // Arrange & Act
                const context = new DragContext(DragType.TEXT, 'test text');

                // Assert - 不変条件
                expect(context.dragType).toBe(DragType.TEXT);
                expect(context.selectedValue).toBe('test text');
            });

            test('readonlyプロパティの一貫性を保つ', () => {
                // Arrange & Act
                const context = new DragContext(DragType.LINK, 'https://example.com');

                // Assert - 不変条件（TypeScriptのreadonlyによる保証）
                expect(context.dragType).toBe(DragType.LINK);
                expect(context.selectedValue).toBe('https://example.com');
                
                // オブジェクトの状態の一貫性
                const originalType = context.dragType;
                const originalValue = context.selectedValue;
                
                expect(context.dragType).toBe(originalType);
                expect(context.selectedValue).toBe(originalValue);
            });
        });
    });

    describe('create メソッド', () => {
        describe('事前条件の検証', () => {
            test('null/undefinedのMouseEventが渡された場合の安全性', () => {
                // Arrange
                const nullEvent = null as any;
                
                // Act & Assert - 事前条件：null値の場合はエラーが発生する
                expect(() => DragContext.create(nullEvent)).toThrow();
            });
        });

        describe('事後条件の検証 - テキスト選択時', () => {
            beforeEach(() => {
                // テキスト選択をモック
                Object.defineProperty(window, 'getSelection', {
                    writable: true,
                    value: jest.fn(() => ({
                        toString: () => 'selected text'
                    }))
                });
            });

            test('テキストが選択されている場合、TEXT型のDragContextを返す', () => {
                // Arrange
                const mockEvent = createMockMouseEvent(document.createElement('div'));

                // Act
                const result = DragContext.create(mockEvent);

                // Assert - 事後条件
                expect(result).toBeInstanceOf(DragContext);
                expect(result.dragType).toBe(DragType.TEXT);
                expect(result.selectedValue).toBe('selected text');
                expect(result.isValid()).toBe(true);
            });
        });

        describe('事後条件の検証 - Aタグクリック時', () => {
            beforeEach(() => {
                // テキスト選択なし
                Object.defineProperty(window, 'getSelection', {
                    writable: true,
                    value: jest.fn(() => ({
                        toString: () => ''
                    }))
                });
            });

            test('Aタグを直接クリックした場合、LINK型のDragContextを返す', () => {
                // Arrange
                const linkElement = document.createElement('a');
                linkElement.href = 'https://example.com/';
                const mockEvent = createMockMouseEvent(linkElement);

                // Act
                const result = DragContext.create(mockEvent);

                // Assert - 事後条件
                expect(result).toBeInstanceOf(DragContext);
                expect(result.dragType).toBe(DragType.LINK);
                expect(result.selectedValue).toBe('https://example.com/');
                expect(result.isValid()).toBe(true);
            });
        });

        describe('事後条件の検証 - IMGタグクリック時', () => {
            beforeEach(() => {
                // テキスト選択なし
                Object.defineProperty(window, 'getSelection', {
                    writable: true,
                    value: jest.fn(() => ({
                        toString: () => ''
                    }))
                });
            });

            test('IMGタグを直接クリックした場合、IMAGE型のDragContextを返す', () => {
                // Arrange
                const imgElement = document.createElement('img');
                imgElement.src = 'https://example.com/image.jpg';
                const mockEvent = createMockMouseEvent(imgElement);

                // Act
                const result = DragContext.create(mockEvent);

                // Assert - 事後条件
                expect(result).toBeInstanceOf(DragContext);
                expect(result.dragType).toBe(DragType.IMAGE);
                expect(result.selectedValue).toBe('https://example.com/image.jpg');
                expect(result.isValid()).toBe(true);
            });
        });

        describe('事後条件の検証 - 子要素のAタグ検索', () => {
            beforeEach(() => {
                // テキスト選択なし
                Object.defineProperty(window, 'getSelection', {
                    writable: true,
                    value: jest.fn(() => ({
                        toString: () => ''
                    }))
                });
            });

            test('子要素にAタグがある場合、LINK型のDragContextを返す', () => {
                // Arrange
                const divElement = document.createElement('div');
                const linkElement = document.createElement('a');
                linkElement.href = 'https://example.com/child';
                divElement.appendChild(linkElement);
                
                // querySelectorをモック
                jest.spyOn(divElement, 'querySelector').mockReturnValue(linkElement);
                
                const mockEvent = createMockMouseEvent(divElement);

                // Act
                const result = DragContext.create(mockEvent);

                // Assert - 事後条件
                expect(result).toBeInstanceOf(DragContext);
                expect(result.dragType).toBe(DragType.LINK);
                expect(result.selectedValue).toBe('https://example.com/child');
                expect(result.isValid()).toBe(true);
            });
        });

        describe('事後条件の検証 - 親要素のAタグ検索', () => {
            beforeEach(() => {
                // テキスト選択なし
                Object.defineProperty(window, 'getSelection', {
                    writable: true,
                    value: jest.fn(() => ({
                        toString: () => ''
                    }))
                });
            });

            test('親要素にAタグがある場合、LINK型のDragContextを返す', () => {
                // Arrange
                const spanElement = document.createElement('span');
                const linkElement = document.createElement('a');
                linkElement.href = 'https://example.com/parent';
                
                // closestをモック
                jest.spyOn(spanElement, 'closest').mockReturnValue(linkElement);
                jest.spyOn(spanElement, 'querySelector').mockReturnValue(null);
                
                const mockEvent = createMockMouseEvent(spanElement);

                // Act
                const result = DragContext.create(mockEvent);

                // Assert - 事後条件
                expect(result).toBeInstanceOf(DragContext);
                expect(result.dragType).toBe(DragType.LINK);
                expect(result.selectedValue).toBe('https://example.com/parent');
                expect(result.isValid()).toBe(true);
            });
        });

        describe('事後条件の検証 - デフォルトケース', () => {
            beforeEach(() => {
                // テキスト選択なし
                Object.defineProperty(window, 'getSelection', {
                    writable: true,
                    value: jest.fn(() => ({
                        toString: () => ''
                    }))
                });
            });

            test('該当する要素がない場合、デフォルトのDragContextを返す', () => {
                // Arrange
                const divElement = document.createElement('div');
                jest.spyOn(divElement, 'querySelector').mockReturnValue(null);
                jest.spyOn(divElement, 'closest').mockReturnValue(null);
                
                const mockEvent = createMockMouseEvent(divElement);

                // Act
                const result = DragContext.create(mockEvent);

                // Assert - 事後条件
                expect(result).toBeInstanceOf(DragContext);
                expect(result.dragType).toBe(DragType.NONE);
                expect(result.selectedValue).toBe('');
                expect(result.isValid()).toBe(false);
            });
        });

        describe('不変条件の検証', () => {
            test('dragTypeとselectedValueが一貫性を保つ', () => {
                // Arrange
                const tests = [
                    { setupSelection: 'text', expectedType: DragType.TEXT, expectedValid: true },
                    { setupSelection: '', expectedType: DragType.NONE, expectedValid: false }
                ];

                tests.forEach(({ setupSelection, expectedType, expectedValid }) => {
                    // Arrange
                    Object.defineProperty(window, 'getSelection', {
                        writable: true,
                        value: jest.fn(() => ({
                            toString: () => setupSelection
                        }))
                    });

                    const divElement = document.createElement('div');
                    jest.spyOn(divElement, 'querySelector').mockReturnValue(null);
                    jest.spyOn(divElement, 'closest').mockReturnValue(null);
                    
                    const mockEvent = createMockMouseEvent(divElement);

                    // Act
                    const result = DragContext.create(mockEvent);

                    // Assert - 不変条件：dragTypeとselectedValueの一貫性
                    expect(result.dragType).toBe(expectedType);
                    expect(result.isValid()).toBe(expectedValid);
                    if (expectedType === DragType.NONE) {
                        expect(result.selectedValue).toBe('');
                    } else {
                        expect(result.selectedValue).not.toBe('');
                    }
                });
            });
        });
    });

    describe('default メソッド', () => {
        describe('事後条件の検証', () => {
            test('NONE型で空文字列のDragContextを返す', () => {
                // Act
                const result = DragContext.default();

                // Assert - 事後条件
                expect(result).toBeInstanceOf(DragContext);
                expect(result.dragType).toBe(DragType.NONE);
                expect(result.selectedValue).toBe('');
                expect(result.isValid()).toBe(false);
            });
        });

        describe('不変条件の検証', () => {
            test('常に同じ状態のオブジェクトを返す', () => {
                // Act
                const result1 = DragContext.default();
                const result2 = DragContext.default();

                // Assert - 不変条件：常に同じ状態
                expect(result1.dragType).toBe(result2.dragType);
                expect(result1.selectedValue).toBe(result2.selectedValue);
                expect(result1.isValid()).toBe(result2.isValid());
            });
        });
    });

    describe('isValid メソッド', () => {
        describe('事後条件の検証', () => {
            test('dragTypeがNONE以外かつselectedValueが空でない場合、trueを返す', () => {
                // Arrange
                const validCases = [
                    { type: DragType.TEXT, value: 'some text' },
                    { type: DragType.LINK, value: 'https://example.com' },
                    { type: DragType.IMAGE, value: 'https://example.com/image.jpg' }
                ];

                validCases.forEach(({ type, value }) => {
                    // Arrange
                    const context = new DragContext(type, value);

                    // Act & Assert - 事後条件
                    expect(context.isValid()).toBe(true);
                });
            });

            test('dragTypeがNONEまたはselectedValueが空の場合、falseを返す', () => {
                // Arrange
                const invalidCases = [
                    { type: DragType.NONE, value: '' },
                    { type: DragType.NONE, value: 'some value' },
                    { type: DragType.TEXT, value: '' },
                    { type: DragType.LINK, value: '' },
                    { type: DragType.IMAGE, value: '' }
                ];

                invalidCases.forEach(({ type, value }) => {
                    // Arrange
                    const context = new DragContext(type, value);

                    // Act & Assert - 事後条件
                    expect(context.isValid()).toBe(false);
                });
            });
        });

        describe('不変条件の検証', () => {
            test('オブジェクトの状態を変更しない', () => {
                // Arrange
                const context = new DragContext(DragType.TEXT, 'test');
                const originalType = context.dragType;
                const originalValue = context.selectedValue;

                // Act
                const isValid = context.isValid();

                // Assert - 不変条件：状態が変更されない
                expect(context.dragType).toBe(originalType);
                expect(context.selectedValue).toBe(originalValue);
                expect(typeof isValid).toBe('boolean');
            });
        });
    });

    describe('定数の不変条件検証', () => {
        test('定数が正しい値を持つ', () => {
            // Assert - 不変条件：定数の値
            expect(DragContext.TAGNAME_A).toBe('A');
            expect(DragContext.TAGNAME_IMG).toBe('IMG');
            expect(DragContext.CSS_SELECTOR_A).toBe('a');
        });
    });
});

// ヘルパー関数
function createMockMouseEvent(target: HTMLElement): MouseEvent {
    return {
        target,
        currentTarget: target,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
    } as any;
} 