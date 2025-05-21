import { GestureActionHandler } from '../../../../src/background/services/gesture_action_handler';
import { GestureActionMessagePayload } from '../../../../src/content/services/message/message_types';
import Logger from '../../../../src/common/logger/logger';
import { GestureActionFactory } from '../../../../src/background/services/gesture_action/gesture_action_factory';
import { BackgroundContainerProvider } from '../../../../src/background/provider/background_container_provider';
import { GestureActionType } from '../../../../src/background/services/gesture_action/gesture_action_type';

jest.mock('../../../../src/common/logger/logger');
jest.mock('../../../../src/background/services/gesture_action/gesture_action_factory');
jest.mock('../../../../src/background/provider/background_container_provider');

describe('GestureActionHandler', () => {
    let handler: GestureActionHandler;
    let mockContainer: any;
    let mockAction: { execute: jest.Mock };

    beforeEach(() => {
        jest.clearAllMocks();
        mockContainer = {};
        (BackgroundContainerProvider as any).mockImplementation(() => ({ getContainer: () => mockContainer }));
        handler = new GestureActionHandler();
        mockAction = { execute: jest.fn() };
        (GestureActionFactory.create as jest.Mock).mockReturnValue(mockAction);
    });

    it('handleでGestureActionFactory.createとexecuteが呼ばれる', async () => {
        const payload: GestureActionMessagePayload = { actionName: GestureActionType.NEW_TAB, params: {} };
        await handler.handle(payload);
        expect(GestureActionFactory.create).toHaveBeenCalledWith(GestureActionType.NEW_TAB, mockContainer);
        expect(mockAction.execute).toHaveBeenCalled();
        expect(Logger.info).toHaveBeenCalledWith('ジェスチャアクション実行完了', { actionName: GestureActionType.NEW_TAB });
    });

    it('アクション実行時に例外が発生した場合Logger.errorが呼ばれる', async () => {
        const payload: GestureActionMessagePayload = { actionName: GestureActionType.NEW_TAB, params: {} };
        (mockAction.execute as jest.Mock).mockRejectedValue(new Error('execute error'));
        await handler.handle(payload);
        expect(Logger.error).toHaveBeenCalledWith('ジェスチャアクション実行エラー', expect.objectContaining({ error: 'execute error', payload }));
    });

    it('未対応のactionNameの場合Logger.errorが呼ばれる', async () => {
        const payload: GestureActionMessagePayload = { actionName: 'unknown_action', params: {} } as any;
        (GestureActionFactory.create as jest.Mock).mockImplementation(() => { throw new Error('未対応のGestureActionType: unknown_action'); });
        await handler.handle(payload);
        expect(Logger.error).toHaveBeenCalledWith('ジェスチャアクション実行エラー', expect.objectContaining({ error: '未対応のGestureActionType: unknown_action', payload }));
    });
}); 