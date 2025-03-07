export default class Environment {
    static isDevelopment(): boolean {
        return process.env.NODE_ENV === 'development';
    }
}
