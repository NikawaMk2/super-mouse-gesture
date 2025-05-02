import { BackgroundContainerProvider } from '../../../src/background/provider/background_container_provider';
import { Container } from 'inversify';

describe('BackgroundContainerProvider', () => {
    let provider: BackgroundContainerProvider;

    beforeEach(() => {
        provider = new BackgroundContainerProvider();
    });

    it('getContainer()はContainerインスタンスを返す', () => {
        const container = provider.getContainer();
        expect(container).toBeInstanceOf(Container);
    });

    it('getContainer()は常に同じインスタンスを返す（シングルトン）', () => {
        const container1 = provider.getContainer();
        const container2 = provider.getContainer();
        expect(container1).toBe(container2);
    });
}); 