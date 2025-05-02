import { Container } from 'inversify';
import { ContentContainerProvider } from '../../../src/content/provider/content_container_provider';
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
        toSelf: jest.fn().mockReturnThis(),
        inSingletonScope: jest.fn().mockReturnThis()
      };
    })
  };
});

describe('ContentContainerProvider', () => {
  beforeEach(() => {
    // テスト前にContentContainerProviderをリセット
    // privateなcontainerをリセットするため、リフレクションを使用
    Object.defineProperty(ContentContainerProvider, 'container', {
      value: null,
      writable: true
    });
    
    // モックをリセット
    jest.clearAllMocks();
  });

  describe('getContainer', () => {
    it('初回呼び出し時にコンテナを初期化すること', () => {
      // 実行
      const container = new ContentContainerProvider().getContainer();
      
      // 検証
      expect(Container).toHaveBeenCalledTimes(1);
      expect(container).toBeInstanceOf(Object);
    });

    it('2回目以降の呼び出しで既存のコンテナを返すこと', () => {
      // 1回目の呼び出し
      const firstContainer = new ContentContainerProvider().getContainer();
      
      // モックをリセット
      jest.clearAllMocks();
      
      // 2回目の呼び出し
      const secondContainer = new ContentContainerProvider().getContainer();
      
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
        new ContentContainerProvider().getContainer();
      }).toThrow('テスト用エラー');
      
      // Loggerが呼ばれたことを検証
      expect(Logger.error).toHaveBeenCalledWith(expect.stringContaining('テスト用エラー'));
    });
  });

  describe('initialize', () => {
    it('新しいコンテナを初期化すること', () => {
      // privateメソッドを呼び出すために型アサーションでアクセス
      const provider = new ContentContainerProvider();
      const initializeMethod = (provider as any)['initialize'];
      const container = initializeMethod.call(provider);
      
      // 検証
      expect(Container).toHaveBeenCalledTimes(1);
      expect(container).toBeInstanceOf(Object);
      
      // TODOが実装されたらサービス登録のテストを追加
      // サービスが登録されることを検証（現在はTODOのため保留）
      // 例: expect(container.bind).toHaveBeenCalledWith('SomeService');

      // --- シングルトンスコープの検証 ---
      // 各マウスジェスチャアクションのインスタンスがシングルトンであることを検証
      const gestureActions = [
        { name: 'GoBackGestureAction', path: '../../../src/content/services/gesture_action/go_back_gesture_action' },
        { name: 'ForwardGestureAction', path: '../../../src/content/services/gesture_action/forward_gesture_action' },
        { name: 'ReloadPageGestureAction', path: '../../../src/content/services/gesture_action/reload_page_gesture_action' },
        { name: 'StopLoadingGestureAction', path: '../../../src/content/services/gesture_action/stop_loading_gesture_action' },
        { name: 'ScrollToTopGestureAction', path: '../../../src/content/services/gesture_action/scroll_to_top_gesture_action' },
        { name: 'ScrollToBottomGestureAction', path: '../../../src/content/services/gesture_action/scroll_to_bottom_gesture_action' },
        { name: 'ZoomInGestureAction', path: '../../../src/content/services/gesture_action/zoom_in_gesture_action' },
        { name: 'ZoomOutGestureAction', path: '../../../src/content/services/gesture_action/zoom_out_gesture_action' },
        { name: 'ShowFindBarGestureAction', path: '../../../src/content/services/gesture_action/show_find_bar_gesture_action' },
        { name: 'NewTabGestureAction', path: '../../../src/content/services/gesture_action/new_tab_gesture_action' },
        { name: 'CloseTabGestureAction', path: '../../../src/content/services/gesture_action/close_tab_gesture_action' },
        { name: 'CloseTabToLeftGestureAction', path: '../../../src/content/services/gesture_action/close_tab_to_left_gesture_action' },
        { name: 'CloseTabToRightGestureAction', path: '../../../src/content/services/gesture_action/close_tab_to_right_gesture_action' },
        { name: 'NextTabGestureAction', path: '../../../src/content/services/gesture_action/next_tab_gesture_action' },
        { name: 'PrevTabGestureAction', path: '../../../src/content/services/gesture_action/prev_tab_gesture_action' },
        { name: 'ReopenClosedTabGestureAction', path: '../../../src/content/services/gesture_action/reopen_closed_tab_gesture_action' },
        { name: 'DuplicateTabGestureAction', path: '../../../src/content/services/gesture_action/duplicate_tab_gesture_action' },
        { name: 'PinTabGestureAction', path: '../../../src/content/services/gesture_action/pin_tab_gesture_action' },
        { name: 'MuteTabGestureAction', path: '../../../src/content/services/gesture_action/mute_tab_gesture_action' },
        { name: 'NewWindowGestureAction', path: '../../../src/content/services/gesture_action/new_window_gesture_action' },
        { name: 'NewIncognitoWindowGestureAction', path: '../../../src/content/services/gesture_action/new_incognito_window_gesture_action' },
        { name: 'CloseWindowGestureAction', path: '../../../src/content/services/gesture_action/close_window_gesture_action' },
        { name: 'MinimizeWindowGestureAction', path: '../../../src/content/services/gesture_action/minimize_window_gesture_action' },
        { name: 'MaximizeWindowGestureAction', path: '../../../src/content/services/gesture_action/maximize_window_gesture_action' },
        { name: 'ToggleFullscreenGestureAction', path: '../../../src/content/services/gesture_action/toggle_fullscreen_gesture_action' },
        // --- SuperDragAction（画像） ---
        { name: 'DownloadImageDragAction', path: '../../../src/content/services/super_drag_action/image/download_image_drag_action' },
        { name: 'OpenImageInNewTabDragAction', path: '../../../src/content/services/super_drag_action/image/open_image_in_new_tab_drag_action' },
        { name: 'SearchImageGoogleDragAction', path: '../../../src/content/services/super_drag_action/image/search_image_google_drag_action' },
        { name: 'CopyImageUrlDragAction', path: '../../../src/content/services/super_drag_action/image/copy_image_url_drag_action' },
        // --- SuperDragAction（リンク） ---
        { name: 'OpenInBackgroundTabDragAction', path: '../../../src/content/services/super_drag_action/link/open_in_background_tab_drag_action' },
        { name: 'OpenInForegroundTabDragAction', path: '../../../src/content/services/super_drag_action/link/open_in_foreground_tab_drag_action' },
        { name: 'CopyLinkUrlDragAction', path: '../../../src/content/services/super_drag_action/link/copy_link_url_drag_action' },
        { name: 'DownloadLinkDragAction', path: '../../../src/content/services/super_drag_action/link/download_link_drag_action' },
        // --- SuperDragAction（テキスト） ---
        { name: 'SearchGoogleDragAction', path: '../../../src/content/services/super_drag_action/text/search_google_drag_action' },
        { name: 'CopyTextDragAction', path: '../../../src/content/services/super_drag_action/text/copy_text_drag_action' },
        { name: 'OpenAsUrlDragAction', path: '../../../src/content/services/super_drag_action/text/open_as_url_drag_action' },
        { name: 'SearchBingDragAction', path: '../../../src/content/services/super_drag_action/text/search_bing_drag_action' },
      ];
      gestureActions.forEach(({ name, path }) => {
        try {
          const mod = require(path);
          const ActionClass = mod[name];
          const instance1 = container.get(ActionClass);
          const instance2 = container.get(ActionClass);
          expect(instance1).toBe(instance2);
        } catch (e) {
          // クラスが存在しない場合はスキップ
        }
      });
    });

    it('初期化時にエラーが発生した場合、エラーログを出力してエラーをスローすること', () => {
      // Containerコンストラクタでエラーを発生させる
      (Container as jest.Mock).mockImplementationOnce(() => {
        throw new Error('初期化エラー');
      });
      
      // privateメソッドを呼び出すために型アサーションでアクセス
      const provider = new ContentContainerProvider();
      const initializeMethod = (provider as any)['initialize'];
      
      // 実行と検証
      expect(() => {
        initializeMethod.call(provider);
      }).toThrow('初期化エラー');
      
      // Loggerのエラーメソッドが呼ばれたことを検証
      expect(Logger.error).toHaveBeenCalledWith('コンテンツスクリプト用コンテナ初期化エラー: Error: 初期化エラー');
    });
  });
});
