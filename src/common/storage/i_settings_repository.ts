export interface ISettingsRepository {
    /**
     * 設定値を取得する
     * @param key 設定キー
     * @returns 設定値（非同期）
     */
    get<T = unknown>(key: string): Promise<T | undefined>;

    /**
     * 設定値を保存する
     * @param key 設定キー
     * @param value 設定値
     */
    set<T = unknown>(key: string, value: T): Promise<void>;

    /**
     * 複数の設定値をまとめて取得する
     * @param keys キー配列
     * @returns キーと値のマップ
     */
    getAll<T = unknown>(keys: string[]): Promise<Record<string, T | undefined>>;
} 