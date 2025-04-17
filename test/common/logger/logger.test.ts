import Logger from '../../../src/common/logger/logger';
import Environment from '../../../src/common/utils/environment';

// Environmentモジュールのモック
jest.mock('../../../src/common/utils/environment', () => ({
  isDevelopment: jest.fn<boolean, []>()
}));

describe('Logger', () => {
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('DEBUGログ', () => {
    it('開発環境ではDEBUGログが出力されること', () => {
      (Environment.isDevelopment as jest.Mock).mockReturnValue(true);
      Logger.debug('デバッグメッセージ', { key: 'value' });
      expect(mockConsoleLog).toHaveBeenCalled();
    });

    it('本番環境ではDEBUGログが出力されないこと', () => {
      (Environment.isDevelopment as jest.Mock).mockReturnValue(false);
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
