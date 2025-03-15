import GestureSettings from '../gesture_settings';

export interface GestureSettingsLoader {
    getSettings(): Promise<GestureSettings>;
}