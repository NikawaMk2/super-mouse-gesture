/**
 * scroll_down_action.ts のユニットテスト
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
import { scrollDownAction } from '@/content/gestures/actions/events/scroll_down_action';
import { logger } from '@/shared/logger';

describe('execute', () => {
  let mockScrollBy: ReturnType<typeof vi.fn>;
  let originalInnerHeight: PropertyDescriptor | undefined;
  let originalScrollBy: PropertyDescriptor | undefined;

  beforeEach(() => {
    // window.scrollBy をモック化
    mockScrollBy = vi.fn();
    originalScrollBy = Object.getOwnPropertyDescriptor(window, 'scrollBy');
    Object.defineProperty(window, 'scrollBy', {
      writable: true,
      configurable: true,
      value: mockScrollBy,
    });

    // window.innerHeight のプロパティディスクリプタを保存
    originalInnerHeight = Object.getOwnPropertyDescriptor(window, 'innerHeight');

    // モックをリセット
    vi.clearAllMocks();
  });

  afterEach(() => {
    // window.innerHeight を元に戻す
    if (originalInnerHeight) {
      Object.defineProperty(window, 'innerHeight', originalInnerHeight);
    } else {
      delete (window as any).innerHeight;
    }

    // window.scrollBy を元に戻す
    if (originalScrollBy) {
      Object.defineProperty(window, 'scrollBy', originalScrollBy);
    } else {
      delete (window as any).scrollBy;
    }
  });

  it.each([
    { innerHeight: 800 },
    { innerHeight: 1200 },
    { innerHeight: 600 },
  ])('window.innerHeightが$innerHeightの場合_その値分だけ下にスクロールしログが正しく出力されること', ({ innerHeight }) => {
    // window.innerHeight を設定
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: innerHeight,
    });

    scrollDownAction.execute();

    expect(mockScrollBy).toHaveBeenCalledTimes(1);
    expect(mockScrollBy).toHaveBeenCalledWith({
      top: innerHeight,
      behavior: 'smooth',
    });
    expect(vi.mocked(logger.debug)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(logger.debug)).toHaveBeenCalledWith(
      'ScrollDownAction',
      `下へスクロール: ${innerHeight}px (ページサイズ分)`
    );
  });
});
