import Environment from './environment';

export default class Logger {
    static debug(message: String) {
        if(!Environment.isDevelopment()) {
            return;
        }

        this.outputLog('DEBUG', message);
    }

    static info(message: String) {
        this.outputLog('INFO', message);
    }

    static warn(message: String) {
        this.outputLog('WARN', message);
    }

    static error(message: String) {
        this.outputErrorLog(message);
    }

    private static outputLog(mode: String, message: String): void {
        console.log(`[${mode}]: ${message}`);
    }

    private static outputErrorLog(message: String): void {
        console.error(`[ERROR]: ${message}`);
    }
}