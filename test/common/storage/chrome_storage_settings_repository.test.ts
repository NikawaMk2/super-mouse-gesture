import { ChromeStorageSettingsRepository } from '../../../src/common/storage/chrome_storage_settings_repository';
import { ISettingsRepository } from '../../../src/common/storage/i_settings_repository';

describe('ChromeStorageSettingsRepository', () => {
    let repository: ISettingsRepository;
    let chromeStorageSyncGetMock: jest.Mock;
    let chromeStorageSyncSetMock: jest.Mock;

    beforeAll(() => {
        // @ts-ignore
        global.chrome = {
            storage: {
                sync: {
                    get: jest.fn(),
                    set: jest.fn(),
                    // 型エラー回避用のダミープロパティ
                    MAX_SUSTAINED_WRITE_OPERATIONS_PER_MINUTE: 120,
                    QUOTA_BYTES: 102400,
                    QUOTA_BYTES_PER_ITEM: 8192,
                    MAX_ITEMS: 512,
                    MAX_WRITE_OPERATIONS_PER_HOUR: 1800,
                    MAX_WRITE_OPERATIONS_PER_MINUTE: 120,
                    onChanged: {
                        addListener: jest.fn(),
                        removeListener: jest.fn(),
                        hasListener: jest.fn(),
                        addRules: jest.fn(),
                        getRules: jest.fn(),
                        removeRules: jest.fn(),
                        hasListeners: jest.fn(),
                    },
                    // SyncStorageArea型の必須メソッド
                    getBytesInUse: jest.fn(),
                    clear: jest.fn(),
                    remove: jest.fn(),
                    setAccessLevel: jest.fn(),
                    getKeys: jest.fn(),
                },
                // storage型の必須プロパティ
                local: {
                    QUOTA_BYTES: 5242880,
                    getBytesInUse: jest.fn(),
                    clear: jest.fn(),
                    set: jest.fn(),
                    get: jest.fn(),
                    remove: jest.fn(),
                    setAccessLevel: jest.fn(),
                    getKeys: jest.fn(),
                    onChanged: {
                        addListener: jest.fn(),
                        removeListener: jest.fn(),
                        hasListener: jest.fn(),
                        addRules: jest.fn(),
                        getRules: jest.fn(),
                        removeRules: jest.fn(),
                        hasListeners: jest.fn(),
                    },
                },
                managed: {
                    getBytesInUse: jest.fn(),
                    clear: jest.fn(),
                    set: jest.fn(),
                    get: jest.fn(),
                    remove: jest.fn(),
                    setAccessLevel: jest.fn(),
                    getKeys: jest.fn(),
                    onChanged: {
                        addListener: jest.fn(),
                        removeListener: jest.fn(),
                        hasListener: jest.fn(),
                        addRules: jest.fn(),
                        getRules: jest.fn(),
                        removeRules: jest.fn(),
                        hasListeners: jest.fn(),
                    },
                },
                session: {
                    QUOTA_BYTES: 102400,
                    getBytesInUse: jest.fn(),
                    clear: jest.fn(),
                    set: jest.fn(),
                    get: jest.fn(),
                    remove: jest.fn(),
                    setAccessLevel: jest.fn(),
                    getKeys: jest.fn(),
                    onChanged: {
                        addListener: jest.fn(),
                        removeListener: jest.fn(),
                        hasListener: jest.fn(),
                        addRules: jest.fn(),
                        getRules: jest.fn(),
                        removeRules: jest.fn(),
                        hasListeners: jest.fn(),
                    },
                },
                onChanged: {
                    addListener: jest.fn(),
                    removeListener: jest.fn(),
                    hasListener: jest.fn(),
                    addRules: jest.fn(),
                    getRules: jest.fn(),
                    removeRules: jest.fn(),
                    hasListeners: jest.fn(),
                },
                AccessLevel: {
                    TRUSTED_AND_UNTRUSTED_CONTEXTS: 'TRUSTED_AND_UNTRUSTED_CONTEXTS',
                    TRUSTED_CONTEXTS: 'TRUSTED_CONTEXTS',
                },
            },
        };
    });

    beforeEach(() => {
        repository = new ChromeStorageSettingsRepository();
        chromeStorageSyncGetMock = (global.chrome.storage.sync.get as jest.Mock);
        chromeStorageSyncSetMock = (global.chrome.storage.sync.set as jest.Mock);
        chromeStorageSyncGetMock.mockReset();
        chromeStorageSyncSetMock.mockReset();
    });

    it('get: 指定キーの値を取得できる', async () => {
        chromeStorageSyncGetMock.mockImplementation((keys, cb) => {
            cb({ testKey: 'testValue' });
        });
        const value = await repository.get<string>('testKey');
        expect(value).toBe('testValue');
        expect(chromeStorageSyncGetMock).toHaveBeenCalledWith(['testKey'], expect.any(Function));
    });

    it('get: 値が存在しない場合はundefined', async () => {
        chromeStorageSyncGetMock.mockImplementation((keys, cb) => {
            cb({});
        });
        const value = await repository.get<string>('notExistKey');
        expect(value).toBeUndefined();
    });

    it('set: 指定キー・値で保存できる', async () => {
        chromeStorageSyncSetMock.mockImplementation((obj, cb) => {
            cb();
        });
        await expect(repository.set('saveKey', 123)).resolves.toBeUndefined();
        expect(chromeStorageSyncSetMock).toHaveBeenCalledWith({ saveKey: 123 }, expect.any(Function));
    });

    it('getAll: 複数キーの値を取得できる', async () => {
        chromeStorageSyncGetMock.mockImplementation((keys, cb) => {
            cb({ key1: 'v1', key2: 'v2' });
        });
        const result = await repository.getAll<string>(['key1', 'key2']);
        expect(result).toEqual({ key1: 'v1', key2: 'v2' });
    });

    it('getAll: 一部キーが存在しない場合はundefined', async () => {
        chromeStorageSyncGetMock.mockImplementation((keys, cb) => {
            cb({ key1: 'v1' });
        });
        const result = await repository.getAll<string>(['key1', 'key2']);
        expect(result).toEqual({ key1: 'v1', key2: undefined });
    });
}); 