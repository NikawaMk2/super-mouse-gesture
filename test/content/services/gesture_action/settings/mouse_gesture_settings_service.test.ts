import { MouseGestureSettingsService } from '../../../../../src/content/services/gesture_action/settings/mouse_gesture_settings_service';
import { MouseGestureSettings, DEFAULT_MOUSE_GESTURE_SETTINGS } from '../../../../../src/common/constants/mouse_gesture_settings';
import { ISettingsRepository } from '../../../../../src/common/storage/i_settings_repository';

describe('MouseGestureSettingsService', () => {
    let repositoryMock: jest.Mocked<ISettingsRepository>;
    let service: MouseGestureSettingsService;

    beforeEach(() => {
        repositoryMock = {
            get: jest.fn(),
            set: jest.fn(),
            getAll: jest.fn(),
        };
        service = new MouseGestureSettingsService(repositoryMock);
    });

    it('設定値が保存されていればそれを返す', async () => {
        const customSettings: MouseGestureSettings = {
            'left': 'goBack',
            'right': 'forward',
        };
        repositoryMock.get.mockResolvedValue(customSettings);
        const result = await service.getSettings();
        expect(result).toEqual(customSettings);
        expect(repositoryMock.get).toHaveBeenCalledWith('mouseGestureSettings');
    });

    it('設定値が未保存の場合はデフォルト値を返す', async () => {
        repositoryMock.get.mockResolvedValue(undefined);
        const result = await service.getSettings();
        expect(result).toEqual(DEFAULT_MOUSE_GESTURE_SETTINGS);
    });
}); 