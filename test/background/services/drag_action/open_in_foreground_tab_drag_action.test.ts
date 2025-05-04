import { OpenInForegroundTabDragAction } from '../../../../src/background/services/drag_action/open_in_foreground_tab_drag_action';
import Logger from '../../../../src/common/logger/logger';

describe('OpenInForegroundTabDragAction', () => {
    const createMock = jest.fn();
    const updateCurrentTabMock = jest.fn();
    const tabOperatorMock = { createTab: createMock, updateCurrentTab: updateCurrentTabMock };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    jest.spyOn(Logger, 'info').mockImplementation(jest.fn());
    jest.spyOn(Logger, 'warn').mockImplementation(jest.fn());
    jest.spyOn(Logger, 'error').mockImplementation(jest.fn());
    jest.spyOn(Logger, 'debug').mockImplementation(jest.fn());

    it('url指定時はtabOperator.createTabがactive: trueで呼ばれる', async () => {
        createMock.mockResolvedValue({ id: 123 });
        const action = new OpenInForegroundTabDragAction(tabOperatorMock);
        const payload = {
            type: 'link' as const,
            direction: 'right' as const,
            actionName: 'openInForegroundTab' as const,
            params: { url: 'https://example.com' },
        };
        await action.execute(payload);
        expect(createMock).toHaveBeenCalledWith('https://example.com', true);
        expect(Logger.debug).toHaveBeenCalledWith('フォアグラウンドタブでリンクを開きました', { tabId: 123, url: 'https://example.com' });
    });

    it('typeがlink以外はwarnログのみ', async () => {
        const action = new OpenInForegroundTabDragAction(tabOperatorMock);
        const payload = {
            type: 'text' as const,
            direction: 'right' as const,
            actionName: 'openInForegroundTab' as const,
            params: { url: 'https://example.com' },
        };
        await action.execute(payload);
        expect(Logger.warn).toHaveBeenCalledWith('リンクタイプ以外は未対応です', { payload });
        expect(createMock).not.toHaveBeenCalled();
    });

    it('url未指定時はwarnログのみ', async () => {
        const action = new OpenInForegroundTabDragAction(tabOperatorMock);
        const payload = {
            type: 'link' as const,
            direction: 'right' as const,
            actionName: 'openInForegroundTab' as const,
            params: {},
        };
        await action.execute(payload);
        expect(Logger.warn).toHaveBeenCalledWith('開くリンクURLが指定されていません', { payload });
        expect(createMock).not.toHaveBeenCalled();
    });

    it('tabOperator.createTabがrejectした場合はerrorログ', async () => {
        createMock.mockRejectedValue(new Error('error!'));
        const action = new OpenInForegroundTabDragAction(tabOperatorMock);
        const payload = {
            type: 'link' as const,
            direction: 'right' as const,
            actionName: 'openInForegroundTab' as const,
            params: { url: 'https://example.com' },
        };
        await action.execute(payload);
        expect(Logger.error).toHaveBeenCalledWith('フォアグラウンドタブでのリンクオープンに失敗', { error: 'error!', url: 'https://example.com' });
    });
}); 