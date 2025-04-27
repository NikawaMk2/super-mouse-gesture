import { ISettingsRepository } from './i_settings_repository';

/**
 * Chromeストレージを利用した設定リポジトリ実装
 */
export class ChromeStorageSettingsRepository implements ISettingsRepository {
    async get<T = unknown>(key: string): Promise<T | undefined> {
        return new Promise((resolve) => {
            chrome.storage.sync.get([key], (result: { [key: string]: T }) => {
                resolve(result[key] as T | undefined);
            });
        });
    }

    async set<T = unknown>(key: string, value: T): Promise<void> {
        return new Promise((resolve) => {
            chrome.storage.sync.set({ [key]: value }, () => {
                resolve();
            });
        });
    }

    async getAll<T = unknown>(keys: string[]): Promise<Record<string, T | undefined>> {
        return new Promise((resolve) => {
           chrome.storage.sync.get(keys, (result: { [key: string]: T }) => {
                const mapped: Record<string, T | undefined> = {};
                keys.forEach((key) => {
                    mapped[key] = result[key] as T | undefined;
                });
                resolve(mapped);
            });
        });
    }
} 