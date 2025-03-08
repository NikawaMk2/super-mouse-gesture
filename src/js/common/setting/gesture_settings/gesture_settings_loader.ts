import GestureSettings from '../gesture_setting/gesture_settings';

export interface GestureSettingsLoader {
    getSettings(): Promise<GestureSettings>;
}