/**
 * scroll_to_top_action.ts のユニットテスト
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
import { scrollToTopAction } from '@/content/gestures/actions/events/scroll_to_top_action';
import { logger } from '@/shared/logger';

describe('scrollToTopAction', () => {
  let mockScrollTo: ReturnType<typeof vi.fn>;
  let originalScrollTo: PropertyDescriptor | undefined;

  beforeEach(() => {
    // window.scrollTo をモック化
    mockScrollTo = vi.fn();
    originalScrollTo = Object.getOwnPropertyDescriptor(window, 'scrollTo');
    Object.defineProperty(window, 'scrollTo', {
      writable: true,
      configurable: true,
      value: mockScrollTo,
    });

    // モックをリセット
    vi.clearAllMocks();
  });

  afterEach(() => {
    // window.scrollTo を元に戻す
    if (originalScrollTo) {
      Object.defineProperty(window, 'scrollTo', originalScrollTo);
    } else {
      delete (window as any).scrollTo;
    }
  });

  it('executeを呼び出す場合_ページトップへスクロールしログが正しく出力されること', () => {
    scrollToTopAction.execute();

    expect(mockScrollTo).toHaveBeenCalledTimes(1);
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'auto',
    });
    expect(vi.mocked(logger.debug)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(logger.debug)).toHaveBeenCalledWith(
      'ScrollToTopAction',
      'ページトップへスクロール'
    );
  });
});

