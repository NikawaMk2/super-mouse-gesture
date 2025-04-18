import { Container } from 'inversify';
import { ContainerProvider } from '../../../src/common/provider/container_provider';
import Logger from '../../../src/common/logger/logger';

// Loggerのモック
jest.mock('../../../src/common/logger/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn()
}));

// Containerクラスのモック
jest.mock('inversify', () => {
  return {
    Container: jest.fn().mockImplementation(() => {
      return {
        // モックContainerに必要なメソッドを追加
        bind: jest.fn().mockReturnThis(),
        to: jest.fn().mockReturnThis(),
        inSingletonScope: jest.fn().mockReturnThis()
      };
    })
  };
});

describe('ContainerProvider', () => {
  beforeEach(() => {
    // テスト前にContainerProviderをリセット
    // privateなcontainerをリセットするため、リフレクションを使用
    Object.defineProperty(ContainerProvider, 'container', {
      value: null,
      writable: true
    });
    
    // モックをリセット
    jest.clearAllMocks();
  });

  describe('getContainer', () => {
    it('初回呼び出し時にコンテナを初期化すること', () => {
      // 実行
      const container = ContainerProvider.getContainer();
      
      // 検証
      expect(Container).toHaveBeenCalledTimes(1);
      expect(container).toBeInstanceOf(Object);
    });

    it('2回目以降の呼び出しで既存のコンテナを返すこと', () => {
      // 1回目の呼び出し
      const firstContainer = ContainerProvider.getContainer();
      
      // モックをリセット
      jest.clearAllMocks();
      
      // 2回目の呼び出し
      const secondContainer = ContainerProvider.getContainer();
      
      // 検証
      expect(Container).not.toHaveBeenCalled(); // 新しいインスタンスが作成されていないこと
      expect(secondContainer).toBe(firstContainer); // 同じインスタンスが返されること
    });

    it('初期化時にエラーが発生した場合、エラーをスローすること', () => {
      // Containerコンストラクタでエラーを発生させる
      (Container as jest.Mock).mockImplementationOnce(() => {
        throw new Error('テスト用エラー');
      });
      
      // 実行と検証
      expect(() => {
        ContainerProvider.getContainer();
      }).toThrow('テスト用エラー');
      
      // Loggerが呼ばれたことを検証
      expect(Logger.error).toHaveBeenCalledWith(expect.stringContaining('テスト用エラー'));
    });
  });

  describe('initialize', () => {
    it('新しいコンテナを初期化すること', () => {
      // privateメソッドを呼び出すためにリフレクションを使用
      const initializeMethod = ContainerProvider['initialize'];
      const container = initializeMethod.call(ContainerProvider);
      
      // 検証
      expect(Container).toHaveBeenCalledTimes(1);
      expect(container).toBeInstanceOf(Object);
      
      // TODOが実装されたらサービス登録のテストを追加
      // サービスが登録されることを検証（現在はTODOのため保留）
      // 例: expect(container.bind).toHaveBeenCalledWith('SomeService');
    });

    it('初期化時にエラーが発生した場合、エラーログを出力してエラーをスローすること', () => {
      // Containerコンストラクタでエラーを発生させる
      (Container as jest.Mock).mockImplementationOnce(() => {
        throw new Error('初期化エラー');
      });
      
      // privateメソッドを呼び出すためにリフレクションを使用
      const initializeMethod = ContainerProvider['initialize'];
      
      // 実行と検証
      expect(() => {
        initializeMethod.call(ContainerProvider);
      }).toThrow('初期化エラー');
      
      // Loggerのエラーメソッドが呼ばれたことを検証
      expect(Logger.error).toHaveBeenCalledWith('バックグラウンドコンテナ初期化エラー: Error: 初期化エラー');
    });
  });
}); 