import Logger from '../../../src/common/logger/logger';
import Environment from '../../../src/common/utils/environment';

// Environmentモジュールのモック
jest.mock('../../../src/common/utils/environment', () => ({
  isProduction: jest.fn<boolean, []>(),
  isTestWithDebugLog: jest.fn<boolean, []>()
}));

describe('Logger', () => {
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
    process.env = originalEnv;
  });

  describe('DEBUGログ', () => {
    it('本番環境ではDEBUGログが出力されないこと', () => {
      (Environment.isProduction as jest.Mock).mockReturnValue(true);
      (Environment.isTestWithDebugLog as jest.Mock).mockReturnValue(true);
      Logger.debug('デバッグメッセージ', { key: 'value' });
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });

    it('テスト環境でDEBUG_LOG=trueならDEBUGログが出力されること', () => {
      (Environment.isProduction as jest.Mock).mockReturnValue(false);
      (Environment.isTestWithDebugLog as jest.Mock).mockReturnValue(true);
      Logger.debug('デバッグメッセージ', { key: 'value' });
      expect(mockConsoleLog).toHaveBeenCalled();
    });

    it('テスト環境でDEBUG_LOGが未設定またはfalseならDEBUGログが出力されないこと', () => {
      (Environment.isProduction as jest.Mock).mockReturnValue(false);
      (Environment.isTestWithDebugLog as jest.Mock).mockReturnValue(false);
      Logger.debug('デバッグメッセージ', { key: 'value' });
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });
  });

  describe('INFOログ', () => {
    it('INFOログが正しく出力されること', () => {
      Logger.info('情報メッセージ', { info: '詳細' });
      expect(mockConsoleLog).toHaveBeenCalled();
    });
  });

  describe('WARNログ', () => {
    it('WARNログが正しく出力されること', () => {
      Logger.warn('警告メッセージ', { warning: '詳細' });
      expect(mockConsoleLog).toHaveBeenCalled();
    });
  });

  describe('ERRORログ', () => {
    it('ERRORログが正しく出力されること', () => {
      Logger.error('エラーメッセージ', { error: '詳細' });
      expect(mockConsoleError).toHaveBeenCalled();
    });
  });

  describe('ログフォーマット', () => {
    it('ログメッセージにタイムスタンプとレベルが含まれること', () => {
      Logger.info('テストメッセージ');
      const logMessage = mockConsoleLog.mock.calls[0][0];
      expect(logMessage).toMatch(/\[INFO\]\[.*\]: テストメッセージ/);
    });

    it('詳細情報が渡された場合、ログに含まれること', () => {
      const details = { key: 'value' };
      Logger.info('テストメッセージ', details);
      expect(mockConsoleLog.mock.calls[0][1]).toBe(details);
    });
  });
});
