import Environment from '../../../src/common/utils/environment';

describe('Environment', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
        process.env.NODE_ENV = originalEnv;
    });

    describe('isDevelopment', () => {
        it('NODE_ENVがdevelopmentの場合、trueを返す', () => {
            process.env.NODE_ENV = 'development';
            expect(Environment.isDevelopment()).toBe(true);
        });

        it('NODE_ENVがdevelopmentでない場合、falseを返す', () => {
            process.env.NODE_ENV = 'production';
            expect(Environment.isDevelopment()).toBe(false);

            process.env.NODE_ENV = 'test';
            expect(Environment.isDevelopment()).toBe(false);
        });
    });
}); 