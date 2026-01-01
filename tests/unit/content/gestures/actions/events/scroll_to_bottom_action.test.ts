/**
 * scroll_to_bottom_action.ts のユニットテスト
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
import { scrollToBottomAction } from '@/content/gestures/actions/events/scroll_to_bottom_action';
import { logger } from '@/shared/logger';

describe('scrollToBottomAction', () => {
  let mockScrollTo: ReturnType<typeof vi.fn>;
  let originalScrollTo: PropertyDescriptor | undefined;
  let originalScrollHeight: PropertyDescriptor | undefined;

  beforeEach(() => {
    // window.scrollTo をモック化
    mockScrollTo = vi.fn();
    originalScrollTo = Object.getOwnPropertyDescriptor(window, 'scrollTo');
    Object.defineProperty(window, 'scrollTo', {
      writable: true,
      configurable: true,
      value: mockScrollTo,
    });

    // document.body.scrollHeight のプロパティディスクリプタを保存
    originalScrollHeight = Object.getOwnPropertyDescriptor(document.body, 'scrollHeight');

    // モックをリセット
    vi.clearAllMocks();
  });

  afterEach(() => {
    // document.body.scrollHeight を元に戻す
    if (originalScrollHeight) {
      Object.defineProperty(document.body, 'scrollHeight', originalScrollHeight);
    } else {
      delete (document.body as any).scrollHeight;
    }

    // window.scrollTo を元に戻す
    if (originalScrollTo) {
      Object.defineProperty(window, 'scrollTo', originalScrollTo);
    } else {
      delete (window as any).scrollTo;
    }
  });

  it.each([
    { scrollHeight: 1000 },
    { scrollHeight: 2000 },
    { scrollHeight: 500 },
  ])('document.body.scrollHeightが$scrollHeightの場合_ページボトムへスクロールしログが正しく出力されること', ({ scrollHeight }) => {
    // document.body.scrollHeight を設定
    Object.defineProperty(document.body, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: scrollHeight,
    });

    scrollToBottomAction.execute();

    expect(mockScrollTo).toHaveBeenCalledTimes(1);
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: scrollHeight,
      behavior: 'auto',
    });
    expect(vi.mocked(logger.debug)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(logger.debug)).toHaveBeenCalledWith(
      'ScrollToBottomAction',
      `ページボトムへスクロール: ${scrollHeight}px`
    );
  });
});

