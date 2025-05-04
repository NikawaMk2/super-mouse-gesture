import { BackgroundContainerProvider } from '../../../src/background/provider/background_container_provider';
import { Container } from 'inversify';

// Containerクラスのモック
jest.mock('inversify', () => {
  return {
    Container: jest.fn().mockImplementation(() => {
      return {
        bind: jest.fn().mockReturnThis(),
        to: jest.fn().mockReturnThis(),
        toSelf: jest.fn().mockReturnThis(),
        inSingletonScope: jest.fn().mockReturnThis(),
        toDynamicValue: jest.fn().mockReturnThis(),
        get: jest.fn()
      };
    })
  };
});

describe('BackgroundContainerProvider', () => {
    let provider: BackgroundContainerProvider;

    beforeEach(() => {
        provider = new BackgroundContainerProvider();
    });

    it('getContainer()はContainerインスタンスを返す', () => {
        const container = provider.getContainer();
        expect(container).toBeInstanceOf(Object);
    });

    it('getContainer()は常に同じインスタンスを返す（シングルトン）', () => {
        const container1 = provider.getContainer();
        const container2 = provider.getContainer();
        expect(container1).toBe(container2);
    });
}); 