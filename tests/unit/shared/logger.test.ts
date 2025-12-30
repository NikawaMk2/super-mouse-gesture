/**
 * logger.ts のユニットテスト
 * 
 * __DEV__ の値を制御して、開発環境と本番環境の両方の動作をテストする。
 */
import { describe, it, expect, beforeEach, afterEach, vi, MockInstance } from 'vitest';

// 型定義（動的インポート用）
type LoggerModule = typeof import('@/shared/logger');

/**
 * 指定した__DEV__値でloggerモジュールを動的にインポートする
 */
async function importLoggerWithDev(isDev: boolean): Promise<LoggerModule> {
    // モジュールキャッシュをリセット
    vi.resetModules();

    // __DEV__ をグローバルに設定
    vi.stubGlobal('__DEV__', isDev);

    // モジュールを動的にインポート
    const module = await import('@/shared/logger');
    return module;
}

describe('logger', () => {
    // コンソールメソッドのモック
    let consoleDebugSpy: MockInstance;
    let consoleInfoSpy: MockInstance;
    let consoleWarnSpy: MockInstance;
    let consoleErrorSpy: MockInstance;

    beforeEach(() => {
        // コンソールメソッドをモック化
        consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => { });
        consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => { });
        consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        // モックをリセット
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    describe('LogLevel', () => {
        it('ログレベルが正しく定義されている', async () => {
            const { LogLevel } = await importLoggerWithDev(true);

            expect(LogLevel.DEBUG).toBe(0);
            expect(LogLevel.INFO).toBe(1);
            expect(LogLevel.WARN).toBe(2);
            expect(LogLevel.ERROR).toBe(3);
        });

        it('ログレベルの大小関係が正しい', async () => {
            const { LogLevel } = await importLoggerWithDev(true);

            expect(LogLevel.DEBUG).toBeLessThan(LogLevel.INFO);
            expect(LogLevel.INFO).toBeLessThan(LogLevel.WARN);
            expect(LogLevel.WARN).toBeLessThan(LogLevel.ERROR);
        });
    });

    describe('開発環境（__DEV__=true）', () => {
        describe('logger.debug', () => {
            it('console.debugを呼び出す', async () => {
                const { logger } = await importLoggerWithDev(true);

                logger.debug('TestContext', 'テストメッセージ');

                expect(consoleDebugSpy).toHaveBeenCalled();
            });

            it('コンテキストとメッセージを含むログを出力', async () => {
                const { logger } = await importLoggerWithDev(true);

                logger.debug('TestContext', 'テストメッセージ');

                const callArgs = consoleDebugSpy.mock.calls[0];
                expect(callArgs).toBeDefined();
                if (!callArgs) return; // TypeScript型ガード
                const logMessage = callArgs[0] as string;
                expect(logMessage).toContain('[DEBUG]');
                expect(logMessage).toContain('[TestContext]');
                expect(logMessage).toContain('テストメッセージ');
            });

            it('データを渡すとログに含まれる', async () => {
                const { logger } = await importLoggerWithDev(true);
                const testData = { key: 'value', number: 123 };

                logger.debug('TestContext', 'データ付きログ', testData);

                expect(consoleDebugSpy).toHaveBeenCalled();
                const callArgs = consoleDebugSpy.mock.calls[0];
                expect(callArgs).toBeDefined();
                if (!callArgs) return; // TypeScript型ガード
                expect(callArgs[1]).toEqual(testData);
            });
        });

        describe('logger.info', () => {
            it('console.infoを呼び出す', async () => {
                const { logger } = await importLoggerWithDev(true);

                logger.info('TestContext', 'INFOメッセージ');

                expect(consoleInfoSpy).toHaveBeenCalled();
            });

            it('コンテキストとメッセージを含むログを出力', async () => {
                const { logger } = await importLoggerWithDev(true);

                logger.info('TestContext', 'INFOメッセージ');

                const callArgs = consoleInfoSpy.mock.calls[0];
                expect(callArgs).toBeDefined();
                if (!callArgs) return; // TypeScript型ガード
                const logMessage = callArgs[0] as string;
                expect(logMessage).toContain('[INFO]');
                expect(logMessage).toContain('[TestContext]');
                expect(logMessage).toContain('INFOメッセージ');
            });

            it('データを渡すとログに含まれる', async () => {
                const { logger } = await importLoggerWithDev(true);
                const testData = ['array', 'items'];

                logger.info('TestContext', 'データ付きINFO', testData);

                expect(consoleInfoSpy).toHaveBeenCalled();
                const callArgs = consoleInfoSpy.mock.calls[0];
                expect(callArgs).toBeDefined();
                if (!callArgs) return; // TypeScript型ガード
                expect(callArgs[1]).toEqual(testData);
            });
        });

        describe('logger.warn', () => {
            it('console.warnを呼び出す', async () => {
                const { logger } = await importLoggerWithDev(true);

                logger.warn('TestContext', 'WARNメッセージ');

                expect(consoleWarnSpy).toHaveBeenCalled();
            });

            it('コンテキストとメッセージを含むログを出力', async () => {
                const { logger } = await importLoggerWithDev(true);

                logger.warn('TestContext', 'WARNメッセージ');

                const callArgs = consoleWarnSpy.mock.calls[0];
                expect(callArgs).toBeDefined();
                if (!callArgs) return; // TypeScript型ガード
                const logMessage = callArgs[0] as string;
                expect(logMessage).toContain('[WARN]');
                expect(logMessage).toContain('[TestContext]');
                expect(logMessage).toContain('WARNメッセージ');
            });

            it('データを渡すとログに含まれる', async () => {
                const { logger } = await importLoggerWithDev(true);
                const testData = new Error('テストエラー');

                logger.warn('TestContext', '警告ログ', testData);

                expect(consoleWarnSpy).toHaveBeenCalled();
                const callArgs = consoleWarnSpy.mock.calls[0];
                expect(callArgs).toBeDefined();
                if (!callArgs) return; // TypeScript型ガード
                expect(callArgs[1]).toEqual(testData);
            });
        });

        describe('logger.error', () => {
            it('console.errorを呼び出す', async () => {
                const { logger } = await importLoggerWithDev(true);

                logger.error('TestContext', 'ERRORメッセージ');

                expect(consoleErrorSpy).toHaveBeenCalled();
            });

            it('コンテキストとメッセージを含むログを出力', async () => {
                const { logger } = await importLoggerWithDev(true);

                logger.error('TestContext', 'ERRORメッセージ');

                const callArgs = consoleErrorSpy.mock.calls[0];
                expect(callArgs).toBeDefined();
                if (!callArgs) return; // TypeScript型ガード
                const logMessage = callArgs[0] as string;
                expect(logMessage).toContain('[ERROR]');
                expect(logMessage).toContain('[TestContext]');
                expect(logMessage).toContain('ERRORメッセージ');
            });

            it('エラーオブジェクトを渡すとログに含まれる', async () => {
                const { logger } = await importLoggerWithDev(true);
                const error = new Error('テストエラー');

                logger.error('TestContext', 'エラー発生', error);

                expect(consoleErrorSpy).toHaveBeenCalled();
                const callArgs = consoleErrorSpy.mock.calls[0];
                expect(callArgs).toBeDefined();
                if (!callArgs) return; // TypeScript型ガード
                expect(callArgs[1]).toEqual(error);
            });
        });
    });

    describe('本番環境（__DEV__=false）', () => {
        describe('logger.debug', () => {
            it('console.debugを呼び出さない（ログレベルがINFO以上のため）', async () => {
                const { logger } = await importLoggerWithDev(false);

                logger.debug('TestContext', 'テストメッセージ');

                expect(consoleDebugSpy).not.toHaveBeenCalled();
            });

            it('データを渡してもconsole.debugは呼び出されない', async () => {
                const { logger } = await importLoggerWithDev(false);
                const testData = { key: 'value' };

                logger.debug('TestContext', 'データ付きログ', testData);

                expect(consoleDebugSpy).not.toHaveBeenCalled();
            });
        });

        describe('logger.info', () => {
            it('console.infoを呼び出す（INFO以上は出力される）', async () => {
                const { logger } = await importLoggerWithDev(false);

                logger.info('TestContext', 'INFOメッセージ');

                expect(consoleInfoSpy).toHaveBeenCalled();
            });
        });

        describe('logger.warn', () => {
            it('console.warnを呼び出す', async () => {
                const { logger } = await importLoggerWithDev(false);

                logger.warn('TestContext', 'WARNメッセージ');

                expect(consoleWarnSpy).toHaveBeenCalled();
            });
        });

        describe('logger.error', () => {
            it('console.errorを呼び出す', async () => {
                const { logger } = await importLoggerWithDev(false);

                logger.error('TestContext', 'ERRORメッセージ');

                expect(consoleErrorSpy).toHaveBeenCalled();
            });
        });
    });

    describe('タイムスタンプ', () => {
        it('ログにタイムスタンプが含まれる', async () => {
            const { logger } = await importLoggerWithDev(true);

            logger.info('TestContext', 'タイムスタンプテスト');

            const callArgs = consoleInfoSpy.mock.calls[0];
            expect(callArgs).toBeDefined();
            if (!callArgs) return; // TypeScript型ガード
            const logMessage = callArgs[0] as string;
            // [HH:MM:SS.mmm] 形式のタイムスタンプをチェック
            expect(logMessage).toMatch(/\[\d{2}:\d{2}:\d{2}\.\d{3}\]/);
        });
    });

    describe('様々なデータ型', () => {
        it('undefinedを渡すと空文字列が出力される', async () => {
            const { logger } = await importLoggerWithDev(true);

            logger.info('TestContext', 'データなし');

            expect(consoleInfoSpy).toHaveBeenCalled();
            const callArgs = consoleInfoSpy.mock.calls[0];
            expect(callArgs).toBeDefined();
            if (!callArgs) return; // TypeScript型ガード
            expect(callArgs[1]).toBe('');
        });

        it('nullを渡すとログに含まれる', async () => {
            const { logger } = await importLoggerWithDev(true);

            logger.info('TestContext', 'nullデータ', null);

            expect(consoleInfoSpy).toHaveBeenCalled();
            const callArgs = consoleInfoSpy.mock.calls[0];
            expect(callArgs).toBeDefined();
            if (!callArgs) return; // TypeScript型ガード
            expect(callArgs[1]).toBeNull();
        });

        it('数値を渡すとログに含まれる', async () => {
            const { logger } = await importLoggerWithDev(true);

            logger.info('TestContext', '数値データ', 42);

            expect(consoleInfoSpy).toHaveBeenCalled();
            const callArgs = consoleInfoSpy.mock.calls[0];
            expect(callArgs).toBeDefined();
            if (!callArgs) return; // TypeScript型ガード
            expect(callArgs[1]).toBe(42);
        });

        it('文字列を渡すとログに含まれる', async () => {
            const { logger } = await importLoggerWithDev(true);

            logger.info('TestContext', '文字列データ', 'additional info');

            expect(consoleInfoSpy).toHaveBeenCalled();
            const callArgs = consoleInfoSpy.mock.calls[0];
            expect(callArgs).toBeDefined();
            if (!callArgs) return; // TypeScript型ガード
            expect(callArgs[1]).toBe('additional info');
        });

        it('ネストしたオブジェクトを渡すとログに含まれる', async () => {
            const { logger } = await importLoggerWithDev(true);
            const nestedData = {
                level1: {
                    level2: {
                        level3: 'deepValue',
                    },
                },
            };

            logger.info('TestContext', 'ネストデータ', nestedData);

            expect(consoleInfoSpy).toHaveBeenCalled();
            const callArgs = consoleInfoSpy.mock.calls[0];
            expect(callArgs).toBeDefined();
            if (!callArgs) return; // TypeScript型ガード
            expect(callArgs[1]).toEqual(nestedData);
        });
    });

    describe('特殊なコンテキスト名', () => {
        it('空文字列のコンテキストでも動作する', async () => {
            const { logger } = await importLoggerWithDev(true);

            logger.info('', 'コンテキストなし');

            expect(consoleInfoSpy).toHaveBeenCalled();
            const callArgs = consoleInfoSpy.mock.calls[0];
            expect(callArgs).toBeDefined();
            if (!callArgs) return; // TypeScript型ガード
            const logMessage = callArgs[0] as string;
            expect(logMessage).toContain('[]');
        });

        it('特殊文字を含むコンテキスト', async () => {
            const { logger } = await importLoggerWithDev(true);

            logger.info('Test/Context:Name', '特殊文字コンテキスト');

            expect(consoleInfoSpy).toHaveBeenCalled();
            const callArgs = consoleInfoSpy.mock.calls[0];
            expect(callArgs).toBeDefined();
            if (!callArgs) return; // TypeScript型ガード
            const logMessage = callArgs[0] as string;
            expect(logMessage).toContain('[Test/Context:Name]');
        });

        it('日本語のコンテキスト名', async () => {
            const { logger } = await importLoggerWithDev(true);

            logger.info('ジェスチャー処理', '日本語コンテキスト');

            expect(consoleInfoSpy).toHaveBeenCalled();
            const callArgs = consoleInfoSpy.mock.calls[0];
            expect(callArgs).toBeDefined();
            if (!callArgs) return; // TypeScript型ガード
            const logMessage = callArgs[0] as string;
            expect(logMessage).toContain('[ジェスチャー処理]');
        });
    });
});
