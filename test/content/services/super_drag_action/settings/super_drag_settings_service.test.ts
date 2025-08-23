import { SuperDragSettingsService } from '../../../../../src/content/services/super_drag_action/settings/super_drag_settings_service';
import { SuperDragSettings, DEFAULT_SUPER_DRAG_SETTINGS } from '../../../../../src/common/constants/super_drag_settings';
import { ISettingsRepository } from '../../../../../src/common/storage/i_settings_repository';

describe('SuperDragSettingsService', () => {
    let repositoryMock: jest.Mocked<ISettingsRepository>;
    let service: SuperDragSettingsService;

    beforeEach(() => {
        repositoryMock = {
            get: jest.fn(),
            set: jest.fn(),
            getAll: jest.fn(),
        };
        service = new SuperDragSettingsService(repositoryMock);
    });

    it('設定値が保存されていればそれを返す', async () => {
        const customSettings: SuperDragSettings = {
            text: {
                right: { action: 'searchGoogle', params: {} },
                left: { action: 'searchBing', params: {} },
                up: { action: 'copyText', params: {} },
                down: { action: 'openAsUrl', params: {} },
                none: { action: '', params: {} },
            },
            link: {
                right: { action: 'openInBackgroundTab', params: {} },
                left: { action: 'openInForegroundTab', params: {} },
                up: { action: 'copyLinkUrl', params: {} },
                down: { action: 'openInBackgroundTab', params: {} },
                none: { action: '', params: {} },
            },
            image: {
                right: { action: 'openImageInNewTab', params: {} },
                left: { action: 'searchImageGoogle', params: {} },
                up: { action: 'copyImageUrl', params: {} },
                down: { action: '', params: {} },
                none: { action: '', params: {} },
            },
            none: {
                right: { action: '', params: {} },
                left: { action: '', params: {} },
                up: { action: '', params: {} },
                down: { action: '', params: {} },
                none: { action: '', params: {} },
            },
        };
        repositoryMock.get.mockResolvedValue(customSettings);
        const result = await service.getSettings();
        expect(result).toEqual(customSettings);
        expect(repositoryMock.get).toHaveBeenCalledWith('superDragSettings');
    });

    it('設定値が未保存の場合はデフォルト値を返す', async () => {
        repositoryMock.get.mockResolvedValue(undefined);
        const result = await service.getSettings();
        expect(result).toEqual(DEFAULT_SUPER_DRAG_SETTINGS);
    });
}); 