import StrageKey from '../../../../const/storage_key';
import Logger from '../../../../utils/logger';
import GestureSettings from '../gesture_settings';
import { GestureSettingsLoader } from './gesture_settings_loader';

export class ChromeGestureSettingsLoader implements GestureSettingsLoader {
    private gestuteSettings: GestureSettings = GestureSettings.emptySettings();
    
    getSettings(): Promise<GestureSettings> {
        return new Promise((resolve, reject) => {
            if (!this.gestuteSettings.isEmpty()) {
                resolve(this.gestuteSettings);
            }

            this.loadSetting(StrageKey.GESTURE_SETTINGS).then((data) => {
                this.gestuteSettings = GestureSettings.fromLoadedSettings(data);
                resolve(this.gestuteSettings);
            }).catch((error) => {
                reject(error);
            });
        });
    }
    
    private loadSetting(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([key])
            .then((result) => {
                if(!result[key]) {
                    reject(new Error(`設定情報無し key: ${key}`));
                }

                resolve(result[key]);
            }).catch((error) => {
                Logger.error(`設定情報読み込み失敗 key: ${key} error: ${error}`);
                reject(error);
            });
        });
    }
}