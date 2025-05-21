import { OpenImageInNewTabDragAction } from '../../../../src/background/services/drag_action/open_image_in_new_tab_drag_action';
import { DragActionMessagePayload } from '../../../../src/content/services/message/message_types';
import { ITabOperator } from '../../../../src/common/provider/tab_operator';

describe('OpenImageInNewTabDragAction', () => {
    let mockTabOperator: ITabOperator;
    let action: OpenImageInNewTabDragAction;

    beforeEach(() => {
        mockTabOperator = {
            createTab: jest.fn().mockResolvedValue({ id: 1 }),
            updateCurrentTab: jest.fn(),
            switchToNextTab: jest.fn(),
            switchToPrevTab: jest.fn(),
            togglePinActiveTab: jest.fn(),
            toggleMuteActiveTab: jest.fn(),
            closeActiveTab: jest.fn(),
            duplicateActiveTab: jest.fn(),
            reopenClosedTab: jest.fn(),
            activateLeftAndCloseActiveTab: jest.fn(),
            activateRightAndCloseActiveTab: jest.fn(),
        };
        action = new OpenImageInNewTabDragAction(mockTabOperator);
    });

    it('画像URLを新しいタブで開く', async () => {
        const payload: DragActionMessagePayload = {
            type: 'image',
            direction: 'up',
            actionName: 'openImageInNewTab',
            params: { url: 'https://example.com/image.png' },
            selectedValue: 'https://example.com/image.png',
        };
        await action.execute(payload);
        expect(mockTabOperator.createTab).toHaveBeenCalledWith('https://example.com/image.png', true);
    });

    it('画像URLが未指定の場合はタブを開かない', async () => {
        const payload: DragActionMessagePayload = {
            type: 'image',
            direction: 'up',
            actionName: 'openImageInNewTab',
            params: {},
            selectedValue: '',
        };
        await action.execute(payload);
        expect(mockTabOperator.createTab).not.toHaveBeenCalled();
    });

    it('タブ作成時に例外が発生した場合もエラーで落ちない', async () => {
        (mockTabOperator.createTab as jest.Mock).mockRejectedValue(new Error('tab error'));
        const payload: DragActionMessagePayload = {
            type: 'image',
            direction: 'up',
            actionName: 'openImageInNewTab',
            params: { url: 'https://example.com/image.png' },
            selectedValue: 'https://example.com/image.png',
        };
        await expect(action.execute(payload)).resolves.not.toThrow();
    });
}); 