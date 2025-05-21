import Environment from '../utils/environment';

// ログレベルの定義
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

// ログの詳細情報の型定義
export interface LogDetails {
    [key: string]: unknown;
}

export default class Logger {
    static debug(message: string, details?: LogDetails) {
        if(Environment.isProduction() || !Environment.isTestWithDebugLog()) {
            return;
        }
        this.outputLog('DEBUG', message, details);
    }

    static info(message: string, details?: LogDetails) {
        this.outputLog('INFO', message, details);
    }

    static warn(message: string, details?: LogDetails) {
        this.outputLog('WARN', message, details);
    }

    static error(message: string, details?: LogDetails) {
        this.outputErrorLog(message, details);
    }

    private static outputLog(level: LogLevel, message: string, details?: LogDetails): void {
        const timestamp = new Date().toISOString();
        console.log(`[${level}][${timestamp}]: ${message}`, details || '');
    }

    private static outputErrorLog(message: string, details?: LogDetails): void {
        const timestamp = new Date().toISOString();
        console.error(`[ERROR][${timestamp}]: ${message}`, details || '');
    }
}