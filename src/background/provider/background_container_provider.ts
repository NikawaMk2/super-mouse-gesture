import { Container } from 'inversify';
import Logger from '../../common/logger/logger';
import { IContainerProvider } from '../../common/provider/i_container_provider';
import { MessageListener } from '../services/message_listener';
import { GestureActionHandler } from '../services/gesture_action_handler';
import { DragActionHandler } from '../services/drag_action_handler';

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
            // サービスクラスをシングルトンでbind
            container.bind(GestureActionHandler).toSelf().inSingletonScope();
            container.bind(DragActionHandler).toSelf().inSingletonScope();
            container.bind(MessageListener).toSelf().inSingletonScope();
            return container;
        } catch (error) {
            Logger.error('バックグラウンドコンテナ初期化エラー', { error });
            throw error;
        }
    }
} 