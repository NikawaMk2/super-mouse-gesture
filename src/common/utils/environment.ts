export default class Environment {
    static isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    }

    static isTestWithDebugLog(): boolean {
        return process.env.NODE_ENV === 'test' || process.env.DEBUG_LOG === 'true';
    }
}
