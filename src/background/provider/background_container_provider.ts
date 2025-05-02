import { Container } from 'inversify';
import Logger from '../../common/logger/logger';
import { IContainerProvider } from '../../common/provider/i_container_provider';

export class BackgroundContainerProvider implements IContainerProvider {
    private container: Container | null = null;

    getContainer(): Container {
        if (this.container === null) {
            this.container = this.initialize();
        }
        return this.container;
    }

    private initialize(): Container {
        try {
            const container = new Container();
            // TODO: 必要なサービスクラスをここでbindする
            return container;
        } catch (error) {
            Logger.error('バックグラウンドコンテナ初期化エラー', { error });
            throw error;
        }
    }
} 