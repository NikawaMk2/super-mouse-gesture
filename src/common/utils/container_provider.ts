import '../utils/reflect_metadata';
import { Container } from 'inversify';
import BackToPreviousGestureAction from '../../content/handlers/gesture_action/back_to_previous_swipe_action';
import CloseAndSelectLeftTabGestureAction from '../../content/handlers/gesture_action/close_and_select_left_tab_swipe_action';
import CloseAndSelectRightTabGestureAction from '../../content/handlers/gesture_action/close_and_select_right_tab_swipe_action';
import GoToNextGestureAction from '../../content/handlers/gesture_action/go_to_next_swipe_action';
import ScrollDownGestureAction from '../../content/handlers/gesture_action/scroll_down_swipe_action';
import ScrollUpGestureAction from '../../content/handlers/gesture_action/scroll_up_swipe_action';
import SelectLeftTabGestureAction from '../../content/handlers/gesture_action/select_left_tab_swipe_action';
import SelectRightTabGestureAction from '../../content/handlers/gesture_action/select_right_tab_swipe_action';
import ScrollBottomGestureAction from '../../content/handlers/gesture_action/scroll_bottom_swipe_action';
import ScrollTopGestureAction from '../../content/handlers/gesture_action/scroll_top_swipe_action';
import NoAction from '../../content/handlers/gesture_action/no_action';
import { BackgroundMessenger } from '../messaging/background_messenger';
import { MessageSender } from '../messaging/message_sender';
import { ChromeTabOperator } from '../../background/services/chrome_tab_operator';
import BackgroundSelectRightTabGestureAction from '../../background/listener/gesture_action/background_select_right_tab_swipe_action';
import BackgroundSelectLeftTabGestureAction from '../../background/listener/gesture_action/background_select_left_tab_swipe_action';
import BackgroundCloseAndSelectRightTabGestureAction from '../../background/listener/gesture_action/background_close_and_select_right_tab_swipe_action';
import BackgroundCloseAndSelectLeftTabGestureAction from '../../background/listener/gesture_action/background_close_and_select_left_tab_swipe_action';
import TYPES from './types';
import Logger from './logger';

export { default as TYPES } from './types';

export default class ContainerProvider {
    private static contentScriptContainer: Container | null = null;
    private static backgroundContainer: Container | null = null;

    static getContentScriptContainer(): Container {
        if (!this.contentScriptContainer) {
            this.contentScriptContainer = this.initializeContentScript();
        }
        return this.contentScriptContainer;
    }

    static getBackgroundContainer(): Container {
        if (!this.backgroundContainer) {
            this.backgroundContainer = this.initializeBackground();
        }
        return this.backgroundContainer;
    }

    private static initializeContentScript(): Container {
        try {
            const container = new Container({ defaultScope: "Singleton" });
            
            // 基本サービスを最初にバインド
            container.bind(BackgroundMessenger).toSelf().inSingletonScope();
            container.bind<MessageSender>(TYPES.MessageSender).to(BackgroundMessenger).inSingletonScope();

            // アクションをバインド
            const actions = [
                CloseAndSelectLeftTabGestureAction,
                CloseAndSelectRightTabGestureAction,
                SelectLeftTabGestureAction,
                SelectRightTabGestureAction,
                BackToPreviousGestureAction,
                ScrollUpGestureAction,
                ScrollDownGestureAction,
                GoToNextGestureAction,
                ScrollTopGestureAction,
                ScrollBottomGestureAction,
                NoAction
            ];

            actions.forEach(action => {
                container.bind(action).toSelf().inSingletonScope();
            });

            Logger.debug('コンテンツスクリプトコンテナ初期化完了');

            return container;
        } catch (error) {
            Logger.error(`コンテンツスクリプトコンテナ初期化エラー: ${error}`);
            throw error;
        }
    }

    private static initializeBackground(): Container {
        try {
            const container = new Container({ defaultScope: "Singleton" });
            
            // 基本サービスをバインド
            container.bind<ChromeTabOperator>(TYPES.ChromeTabOperator).to(ChromeTabOperator).inSingletonScope();

            // バックグラウンドアクションをバインド
            const backgroundActions = [
                BackgroundSelectRightTabGestureAction,
                BackgroundSelectLeftTabGestureAction,
                BackgroundCloseAndSelectRightTabGestureAction,
                BackgroundCloseAndSelectLeftTabGestureAction
            ];

            backgroundActions.forEach(action => {
                container.bind(action).toSelf().inSingletonScope();
            });

            Logger.debug('バックグラウンドコンテナ初期化完了');

            return container;
        } catch (error) {
            Logger.error(`バックグラウンドコンテナ初期化エラー: ${error}`);
            throw error;
        }
    }
}
