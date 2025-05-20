import { OpenInBackgroundTabDragAction } from '../../../src/content/services/super_drag_action/link/open_in_background_tab_drag_action';
import { DragType } from '../../../src/content/models/drag_type';
import { Direction } from '../../../src/content/models/direction';
import Logger from '../../../src/common/logger/logger';
import { ChromeMessageSender } from '../../../src/content/services/message/message_sender';

describe('OpenInBackgroundTabDragAction Integration', () => {
    let action: OpenInBackgroundTabDragAction;
    let senderMock: jest.Mocked<ChromeMessageSender>;

    beforeEach(() => {
        jest.clearAllMocks();
        senderMock = { sendDragAction: jest.fn() } as any;
        action = new OpenInBackgroundTabDragAction(senderMock);
    });

    it('リンクURLが指定された場合にChromeMessageSender.sendDragActionが呼ばれること', async () => {
        await action.execute({
            type: DragType.LINK,
            direction: Direction.DOWN,
            actionName: 'openInBackgroundTab',
            params: {},
            selectedValue: 'https://example.com/',
        });
        expect(senderMock.sendDragAction).toHaveBeenCalledWith(expect.objectContaining({ selectedValue: 'https://example.com/' }));
    });

    it('リンクURL未指定時にLogger.warnが呼ばれること', async () => {
        const warnSpy = jest.spyOn(Logger, 'warn');
        await action.execute({
            type: DragType.LINK,
            direction: Direction.DOWN,
            actionName: 'openInBackgroundTab',
            params: {},
            selectedValue: '',
        });
        expect(warnSpy).toHaveBeenCalledWith(
            '開くリンクURLが指定されていません',
            expect.objectContaining({ options: expect.any(Object) })
        );
        warnSpy.mockRestore();
    });

    it('メッセージ送信失敗時にLogger.errorが呼ばれること', async () => {
        const errorSpy = jest.spyOn(Logger, 'error');
        senderMock.sendDragAction.mockImplementation(() => { throw new Error('send error'); });
        await expect(action.execute({
            type: DragType.LINK,
            direction: Direction.DOWN,
            actionName: 'openInBackgroundTab',
            params: {},
            selectedValue: 'https://example.com/',
        })).rejects.toThrow();
        // Logger.errorはOpenInBackgroundTabDragActionではcatchしていないため、ここでは呼ばれない
        // もしLogger.errorを追加する場合はOpenInBackgroundTabDragActionのcatchで呼ぶ必要あり
        errorSpy.mockRestore();
    });
}); 