import { ISettingsRepository } from '../../../../common/storage/i_settings_repository';
import { SuperDragSettings, DEFAULT_SUPER_DRAG_SETTINGS } from '../../../../common/constants/super_drag_settings';

export class SuperDragSettingsService {
    private readonly repository: ISettingsRepository;
    private readonly SETTINGS_KEY = 'superDragSettings';

    constructor(repository: ISettingsRepository) {
        this.repository = repository;
    }

    async getSettings(): Promise<SuperDragSettings> {
        const settings = await this.repository.get<SuperDragSettings>(this.SETTINGS_KEY);
        return settings ?? DEFAULT_SUPER_DRAG_SETTINGS;
    }
} 