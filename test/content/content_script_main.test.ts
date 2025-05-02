/**
 * @jest-environment jsdom
 */
import { ContentScriptMain } from '../../src/content/content_script_main';
import Logger from '../../src/common/logger/logger';

// 依存ハンドラのモック
const mockMouseGestureHandler = {
  onMouseDown: jest.fn(),
  onMouseMove: jest.fn(),
  onMouseUp: jest.fn(),
  onContextMenu: jest.fn(),
  destroy: jest.fn(),
};
const mockSuperDragHandler = {
  onMouseDown: jest.fn(),
  onDragStart: jest.fn(),
  onDrag: jest.fn(),
  onDragEnd: jest.fn().mockResolvedValue(undefined),
  destroy: jest.fn(),
};

jest.mock('../../src/content/handlers/mouse_gesture_handler', () => ({
  MouseGestureHandler: jest.fn(() => mockMouseGestureHandler),
}));
jest.mock('../../src/content/handlers/super_drag_handler', () => ({
  SuperDragHandler: jest.fn(() => mockSuperDragHandler),
}));
jest.mock('../../src/common/logger/logger');

const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

describe('ContentScriptMain', () => {
  let main: ContentScriptMain;

  beforeEach(() => {
    jest.clearAllMocks();
    main = new ContentScriptMain();
  });

  afterEach(() => {
    main.destroy();
  });

  it('コンストラクタでイベントリスナーが登録される', () => {
    expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('contextmenu', expect.any(Function), true);
    expect(addEventListenerSpy).toHaveBeenCalledWith('dragstart', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('drag', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('dragend', expect.any(Function));
    expect(Logger.debug).toHaveBeenCalledWith('ContentScriptMain: イベントリスナーを設定');
  });

  it('destroyでイベントリスナー解除とハンドラdestroyが呼ばれる', () => {
    main.destroy();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('contextmenu', expect.any(Function), true);
    expect(removeEventListenerSpy).toHaveBeenCalledWith('dragstart', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('drag', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('dragend', expect.any(Function));
    expect(mockMouseGestureHandler.destroy).toHaveBeenCalled();
    expect(mockSuperDragHandler.destroy).toHaveBeenCalled();
    expect(Logger.debug).toHaveBeenCalledWith('ContentScriptMain インスタンス破棄');
  });

  it('右クリックでmouseGestureHandler.onMouseDownが呼ばれる', () => {
    const event = { button: 2 } as MouseEvent;
    (main as any).onMouseDown(event);
    expect(mockMouseGestureHandler.onMouseDown).toHaveBeenCalledWith(event);
  });

  it('左クリックでsuperDragHandler.onMouseDownが呼ばれる', () => {
    const event = { button: 0 } as MouseEvent;
    (main as any).onMouseDown(event);
    expect(mockSuperDragHandler.onMouseDown).toHaveBeenCalledWith(event);
  });

  it('mousemoveでmouseGestureHandler.onMouseMoveが呼ばれる', () => {
    const event = {} as MouseEvent;
    (main as any).onMouseMove(event);
    expect(mockMouseGestureHandler.onMouseMove).toHaveBeenCalledWith(event);
  });

  it('mouseupでmouseGestureHandler.onMouseUpが呼ばれる', () => {
    const event = {} as MouseEvent;
    (main as any).onMouseUp(event);
    expect(mockMouseGestureHandler.onMouseUp).toHaveBeenCalledWith(event);
  });

  it('contextmenuでmouseGestureHandler.onContextMenuが呼ばれる', () => {
    const event = {} as MouseEvent;
    (main as any).onContextMenu(event);
    expect(mockMouseGestureHandler.onContextMenu).toHaveBeenCalledWith(event);
  });

  it('dragstartでsuperDragHandler.onDragStartが呼ばれる', () => {
    const event = {} as DragEvent;
    (main as any).onDragStart(event);
    expect(mockSuperDragHandler.onDragStart).toHaveBeenCalledWith(event);
  });

  it('dragでsuperDragHandler.onDragが呼ばれる', () => {
    const event = {} as DragEvent;
    (main as any).onDrag(event);
    expect(mockSuperDragHandler.onDrag).toHaveBeenCalledWith(event);
  });

  it('dragendでsuperDragHandler.onDragEndがawaitされる', async () => {
    const event = {} as DragEvent;
    await (main as any).onDragEnd(event);
    expect(mockSuperDragHandler.onDragEnd).toHaveBeenCalledWith(event);
  });
}); 