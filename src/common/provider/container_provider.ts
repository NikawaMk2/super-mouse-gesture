// DIコンテナの初期化・呼び出しへの提供を行うクラス
import { Container } from 'inversify';
import Logger from '../logger/logger';

export class ContainerProvider {
    private static container: Container | null = null;

    public static getContainer(): Container {
        if (this.container === null) {
            this.container = this.initialize();
        }
        return this.container;
    }

    private static initialize(): Container {
        try {
            const container = new Container();

            // TODO:コンテナにサービスを登録
    
    
            return container;
        } catch (error) {
            Logger.error(`バックグラウンドコンテナ初期化エラー: ${error}`);
            throw error;
        }
    }
}
