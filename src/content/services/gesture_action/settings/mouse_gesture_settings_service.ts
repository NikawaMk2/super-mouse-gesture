import { ISettingsRepository } from '../../../../common/storage/i_settings_repository';
import { MouseGestureSettings, DEFAULT_MOUSE_GESTURE_SETTINGS } from '../../../../common/constants/mouse_gesture_settings';

export class MouseGestureSettingsService {
    private readonly repository: ISettingsRepository;
    private readonly SETTINGS_KEY = 'mouseGestureSettings';

    constructor(repository: ISettingsRepository) {
        this.repository = repository;
    }

    async getSettings(): Promise<MouseGestureSettings> {
        const settings = await this.repository.get<MouseGestureSettings>(this.SETTINGS_KEY);
        return settings ?? DEFAULT_MOUSE_GESTURE_SETTINGS;
    }
} 