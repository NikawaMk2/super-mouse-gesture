import { MessageListener, IGestureActionHandler, IDragActionHandler } from '../../../src/background/services/message_listener';
import { GestureActionMessagePayload, DragActionMessagePayload } from '../../../src/content/services/message/message_types';

describe('MessageListener', () => {
    let gestureActionHandler: IGestureActionHandler;
    let dragActionHandler: IDragActionHandler;
    let listener: MessageListener;

    beforeEach(() => {
        gestureActionHandler = { handle: jest.fn() };
        dragActionHandler = { handle: jest.fn() };
        listener = new MessageListener(gestureActionHandler, dragActionHandler);
    });

    it('should call gestureActionHandler.handle when action is executeGestureAction', async () => {
        const payload: GestureActionMessagePayload = { actionName: 'test', params: {} };
        const message = { action: 'executeGestureAction', payload };
        const sendResponse = jest.fn();
        // @ts-ignore
        await listener['gestureActionHandler'].handle(message.payload);
        expect(gestureActionHandler.handle).toHaveBeenCalledWith(payload);
    });

    it('should call dragActionHandler.handle when action is executeDragAction', async () => {
        const payload: DragActionMessagePayload = { type: 'text', direction: 'up', actionName: 'test', params: {} };
        const message = { action: 'executeDragAction', payload };
        const sendResponse = jest.fn();
        // @ts-ignore
        await listener['dragActionHandler'].handle(message.payload);
        expect(dragActionHandler.handle).toHaveBeenCalledWith(payload);
    });
}); 