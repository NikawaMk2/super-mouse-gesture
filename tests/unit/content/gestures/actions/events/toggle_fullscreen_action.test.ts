/**
 * toggle_fullscreen_action.ts のユニットテスト
 */

// モジュールをモック化（インポートの前に配置）
vi.mock('@/shared/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// モック設定後にインポート
import { toggleFullscreenAction } from '@/content/gestures/actions/events/toggle_fullscreen_action';
import { logger } from '@/shared/logger';

describe('execute', () => {
  let mockRequestFullscreen: ReturnType<typeof vi.fn>;
  let mockExitFullscreen: ReturnType<typeof vi.fn>;
  let originalFullscreenElement: PropertyDescriptor | undefined;

  beforeEach(() => {
    // DOM API をモック化
    mockRequestFullscreen = vi.fn().mockResolvedValue(undefined);
    mockExitFullscreen = vi.fn().mockResolvedValue(undefined);

    // document.documentElement.requestFullscreen をモック化
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      writable: true,
      configurable: true,
      value: mockRequestFullscreen,
    });

    // document.exitFullscreen をモック化
    Object.defineProperty(document, 'exitFullscreen', {
      writable: true,
      configurable: true,
      value: mockExitFullscreen,
    });

    // document.fullscreenElement のプロパティディスクリプタを保存
    originalFullscreenElement = Object.getOwnPropertyDescriptor(document, 'fullscreenElement');

    // モックをリセット
    vi.clearAllMocks();
  });

  afterEach(() => {
    // document.fullscreenElement を元に戻す
    if (originalFullscreenElement) {
      Object.defineProperty(document, 'fullscreenElement', originalFullscreenElement);
    } else {
      delete (document as any).fullscreenElement;
    }
  });

  it('フルスクリーンでない場合_フルスクリーン表示に切り替わること', () => {
    // document.fullscreenElement を null に設定（フルスクリーンでない状態）
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      configurable: true,
      value: null,
    });

    toggleFullscreenAction.execute();

    expect(mockRequestFullscreen).toHaveBeenCalledTimes(1);
    expect(mockExitFullscreen).not.toHaveBeenCalled();
    expect(vi.mocked(logger.debug)).toHaveBeenCalledWith(
      'ToggleFullscreenAction',
      'フルスクリーン切り替え'
    );
  });

  it('フルスクリーンの場合_フルスクリーン表示が終了すること', () => {
    // document.fullscreenElement を document.documentElement に設定（フルスクリーンの状態）
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      configurable: true,
      value: document.documentElement,
    });

    toggleFullscreenAction.execute();

    expect(mockExitFullscreen).toHaveBeenCalledTimes(1);
    expect(mockRequestFullscreen).not.toHaveBeenCalled();
    expect(vi.mocked(logger.debug)).toHaveBeenCalledWith(
      'ToggleFullscreenAction',
      'フルスクリーン切り替え'
    );
  });

  it('フルスクリーン開始時にエラーが発生した場合_エラーがログに記録されること', async () => {
    // document.fullscreenElement を null に設定（フルスクリーンでない状態）
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      configurable: true,
      value: null,
    });

    // requestFullscreen がエラーを返すように設定
    const error = new Error('Request fullscreen failed');
    mockRequestFullscreen.mockRejectedValue(error);

    toggleFullscreenAction.execute();

    // 非同期処理が完了するまで待つ
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(mockRequestFullscreen).toHaveBeenCalledTimes(1);
    expect(vi.mocked(logger.error)).toHaveBeenCalledWith(
      'ToggleFullscreenAction',
      'フルスクリーン開始エラー',
      error
    );
  });

  it('フルスクリーン終了時にエラーが発生した場合_エラーがログに記録されること', async () => {
    // document.fullscreenElement を document.documentElement に設定（フルスクリーンの状態）
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      configurable: true,
      value: document.documentElement,
    });

    // exitFullscreen がエラーを返すように設定
    const error = new Error('Exit fullscreen failed');
    mockExitFullscreen.mockRejectedValue(error);

    toggleFullscreenAction.execute();

    // 非同期処理が完了するまで待つ
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(mockExitFullscreen).toHaveBeenCalledTimes(1);
    expect(vi.mocked(logger.error)).toHaveBeenCalledWith(
      'ToggleFullscreenAction',
      'フルスクリーン終了エラー',
      error
    );
  });
});

