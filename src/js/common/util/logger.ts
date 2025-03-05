export default class Logger {
    private static isDevelopment = process.env.NODE_ENV === 'development' ? true : false;

    static debug(message: String) {
        if(!this.isDevelopment) {
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