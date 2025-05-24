/**
 * @jest-environment jsdom
 */
import { SuperDragHandler } from '../../../src/content/handlers/super_drag_handler';
import { DragType } from '../../../src/content/models/drag_type';
import { Direction } from '../../../src/content/models/direction';
import { Point } from '../../../src/content/models/point';
import { SuperDragSettingsService } from '../../../src/content/services/super_drag_action/settings/super_drag_settings_service';
import { SuperDragActionFactory } from '../../../src/content/services/super_drag_action/super_drag_action_factory';
import { SuperDragActionType } from '../../../src/content/services/super_drag_action/super_drag_action_type';

// Logger, ActionNotification, SuperDragActionFactoryのモック
jest.mock('../../../src/common/logger/logger');
jest.mock('../../../src/content/handlers/action_notification');
jest.mock('../../../src/content/services/super_drag_action/super_drag_action_factory');

// Pointのメソッドは本物を使う

describe('SuperDragHandler', () => {
    let handler: SuperDragHandler;
    let mockSettingsService: jest.Mocked<SuperDragSettingsService>;
    let mockFactoryCreate: jest.Mock;
    let mockAction: { execute: jest.Mock };

    beforeEach(() => {
        jest.clearAllMocks();
        mockSettingsService = {
            getSettings: jest.fn().mockResolvedValue({
                [DragType.TEXT]: { [Direction.RIGHT]: { action: SuperDragActionType.SEARCH_GOOGLE, params: { url: 'https://www.google.com/search?q=%s' } } },
                [DragType.LINK]: { [Direction.RIGHT]: { action: SuperDragActionType.OPEN_IN_FOREGROUND_TAB, params: {} } },
                [DragType.IMAGE]: { [Direction.RIGHT]: { action: SuperDragActionType.SEARCH_IMAGE_GOOGLE, params: { url: 'https://www.google.com/searchbyimage?image_url=%s' } } },
            })
        } as any;
        handler = new SuperDragHandler(mockSettingsService);
        // ActionFactoryのcreateは常にmockActionを返す
        mockAction = { execute: jest.fn() };
        mockFactoryCreate = (SuperDragActionFactory.create as jest.Mock).mockReturnValue(mockAction);
    });

    function createMouseEvent(type: string, targetTag: string, x = 10, y = 10): MouseEvent {
        const elem = document.createElement(targetTag);
        const event = new window.MouseEvent(type, { clientX: x, clientY: y, bubbles: true }) as any as MouseEvent;
        Object.defineProperty(event, 'target', { value: elem });
        return event;
    }

    function createDragEvent(type: string, targetTag: string, x = 10, y = 10): DragEvent | MouseEvent {
        if (typeof window.DragEvent === 'function') {
            const elem = document.createElement(targetTag);
            const event = new window.DragEvent(type, { clientX: x, clientY: y, bubbles: true }) as any as DragEvent;
            Object.defineProperty(event, 'target', { value: elem });
            return event;
        } else {
            // fallback: MouseEvent
            return createMouseEvent(type, targetTag, x, y);
        }
    }

    test('onMouseDown: テキスト選択時はdragTypeがtextになる', () => {
        const sel = { toString: () => 'abc' };
        jest.spyOn(window, 'getSelection').mockReturnValue(sel as any);
        const e = createMouseEvent('mousedown', 'DIV');
        handler.onMouseDown(e);
        expect((handler as any).dragContext.dragType).toBe(DragType.TEXT);
        expect((handler as any).isDrag).toBe(true);
    });

    test('onMouseDown: aタグはdragTypeがlinkになる', () => {
        jest.spyOn(window, 'getSelection').mockReturnValue({ toString: () => '' } as any);
        const e = createMouseEvent('mousedown', 'A');
        handler.onMouseDown(e);
        expect((handler as any).dragContext.dragType).toBe(DragType.LINK);
        expect((handler as any).isDrag).toBe(true);
    });

    test('onMouseDown: imgタグはdragTypeがimageになる', () => {
        jest.spyOn(window, 'getSelection').mockReturnValue({ toString: () => '' } as any);
        const e = createMouseEvent('mousedown', 'IMG');
        handler.onMouseDown(e);
        expect((handler as any).dragContext.dragType).toBe(DragType.IMAGE);
        expect((handler as any).isDrag).toBe(true);
    });

    test('onMouseDown: 対象外要素はdragTypeがnoneになる', () => {
        jest.spyOn(window, 'getSelection').mockReturnValue({ toString: () => '' } as any);
        const e = createMouseEvent('mousedown', 'DIV');
        handler.onMouseDown(e);
        expect((handler as any).dragContext.dragType).toBe(DragType.NONE);
        expect((handler as any).isDrag).toBe(false);
    });

    test('onDragStart: isDrag=false時は例外が発生しない', () => {
        const e = createDragEvent('dragstart', 'DIV');
        expect(() => handler.onDragStart(e as any)).not.toThrow();
    });

    test('onDrag: isDrag=false時は例外が発生しない', () => {
        const e = createDragEvent('drag', 'DIV');
        expect(() => handler.onDrag(e as any)).not.toThrow();
    });

    test('onDragEnd: directionがnoneならアクションが実行されない', async () => {
        jest.spyOn(window, 'getSelection').mockReturnValue({ toString: () => 'abc' } as any);
        const e = createMouseEvent('mousedown', 'DIV');
        handler.onMouseDown(e);
        jest.spyOn(Point.prototype, 'getDirection').mockReturnValue(Direction.NONE);
        const dragE = createDragEvent('dragend', 'DIV', 10, 10);
        await handler.onDragEnd(dragE as any);
        expect(mockFactoryCreate).not.toHaveBeenCalled();
    });

    test('onDragEnd: directionが有効ならアクションが実行される', async () => {
        jest.spyOn(window, 'getSelection').mockReturnValue({ toString: () => 'abc' } as any);
        const e = createMouseEvent('mousedown', 'DIV');
        handler.onMouseDown(e);
        jest.spyOn(Point.prototype, 'getDirection').mockReturnValue(Direction.RIGHT);
        const dragE = createDragEvent('dragend', 'DIV', 50, 10);
        await handler.onDragEnd(dragE as any);
        expect(mockFactoryCreate.mock.calls[0][0]).toBe(SuperDragActionType.SEARCH_GOOGLE);
        expect(mockAction.execute).toHaveBeenCalledWith(expect.objectContaining({ type: 'text', direction: Direction.RIGHT, actionName: 'searchGoogle' }));
    });

    test('onDragEnd: アクション生成失敗時も例外が発生しない', async () => {
        jest.spyOn(window, 'getSelection').mockReturnValue({ toString: () => 'abc' } as any);
        const e = createMouseEvent('mousedown', 'DIV');
        handler.onMouseDown(e);
        jest.spyOn(Point.prototype, 'getDirection').mockReturnValue(Direction.RIGHT);
        mockFactoryCreate.mockImplementationOnce(() => { throw new Error('fail'); });
        const dragE = createDragEvent('dragend', 'DIV', 50, 10);
        await expect(handler.onDragEnd(dragE as any)).resolves.toBeUndefined();
    });

    test('isActive: ドラッグ中はtrue、終了後はfalseを返す', () => {
        jest.spyOn(window, 'getSelection').mockReturnValue({ toString: () => 'abc' } as any);
        const e = createMouseEvent('mousedown', 'DIV');
        handler.onMouseDown(e);
        expect(handler.isActive()).toBe(true);
        (handler as any).isDrag = false;
        expect(handler.isActive()).toBe(false);
    });

    test('destroy: 例外が発生せず正常に破棄できる', () => {
        expect(() => handler.destroy()).not.toThrow();
    });
}); 