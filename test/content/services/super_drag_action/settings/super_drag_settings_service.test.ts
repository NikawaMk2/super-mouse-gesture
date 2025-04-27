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
            text: { right: 'searchGoogle', left: 'searchBing', up: 'copyText', down: 'openAsUrl', none: '' },
            link: { right: 'openInBackgroundTab', left: 'openInForegroundTab', up: 'copyLinkUrl', down: 'downloadLink', none: '' },
            image: { right: 'openImageInNewTab', left: 'searchImageGoogle', up: 'copyImageUrl', down: 'downloadImage', none: '' },
            none: { right: '', left: '', up: '', down: '', none: '' },
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