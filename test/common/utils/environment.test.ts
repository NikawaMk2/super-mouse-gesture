import Environment from '../../../src/common/utils/environment';

describe('Environment', () => {
    const originalEnv = process.env.NODE_ENV;
    const originalDebugLog = process.env.DEBUG_LOG;
    
    afterEach(() => {
        process.env.NODE_ENV = originalEnv;
        process.env.DEBUG_LOG = originalDebugLog;
    });

    describe('isProduction', () => {
        it('NODE_ENVがproductionの場合、trueを返す', () => {
            process.env.NODE_ENV = 'production';
            expect(Environment.isProduction()).toBe(true);
        });
        it('NODE_ENVがproduction以外の場合、falseを返す', () => {
            process.env.NODE_ENV = 'development';
            expect(Environment.isProduction()).toBe(false);
            process.env.NODE_ENV = 'test';
            expect(Environment.isProduction()).toBe(false);
        });
    });

    describe('isTestWithDebugLog', () => {
        it('NODE_ENVがtestかつDEBUG_LOGが"true"の場合、trueを返す', () => {
            process.env.NODE_ENV = 'test';
            process.env.DEBUG_LOG = 'true';
            expect(Environment.isTestWithDebugLog()).toBe(true);
        });
        it('NODE_ENVがtestかつDEBUG_LOGが"true"でない場合、trueを返す', () => {
            process.env.NODE_ENV = 'test';
            process.env.DEBUG_LOG = 'false';
            expect(Environment.isTestWithDebugLog()).toBe(true);
            process.env.DEBUG_LOG = undefined;
            expect(Environment.isTestWithDebugLog()).toBe(true);
        });
        it('NODE_ENVがtest以外かつDEBUG_LOGが"true"の場合、trueを返す', () => {
            process.env.NODE_ENV = 'production';
            process.env.DEBUG_LOG = 'true';
            expect(Environment.isTestWithDebugLog()).toBe(true);
            process.env.NODE_ENV = 'development';
            expect(Environment.isTestWithDebugLog()).toBe(true);
        });

        it('NODE_ENVがtest以外かつDEBUG_LOGが"true"でない場合、falseを返す', () => {
            process.env.NODE_ENV = 'production';
            process.env.DEBUG_LOG = 'false';
            expect(Environment.isTestWithDebugLog()).toBe(false);
        });
    });
}); 