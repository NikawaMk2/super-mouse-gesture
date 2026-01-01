/**
 * message-sender.ts のユニットテスト
 */

// loggerをモック化（インポートの前に配置）
vi.mock('@/shared/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// モック設定後にインポート
import { sendMessageWithRetry } from '@/shared/utils/message-sender';
import type { ExtensionMessage } from '@/shared/types/extension-message';
import { ExtensionMessageType } from '@/shared/types/extension-message';

describe('sendMessageWithRetry', () => {
  let mockSendMessage: ReturnType<typeof vi.fn>;

  const testMessage: ExtensionMessage = {
    type: ExtensionMessageType.OPEN_NEW_TAB,
    payload: {
      url: 'https://example.com',
      active: true,
    },
  };

  beforeEach(() => {
    mockSendMessage = vi.fn();
    global.chrome = {
      runtime: {
        sendMessage: mockSendMessage,
      },
    } as unknown as typeof chrome;

    // タイマーをモック化
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('初回で成功する場合_正常に完了すること', async () => {
    mockSendMessage.mockResolvedValue(undefined);

    await expect(sendMessageWithRetry(testMessage)).resolves.toBeUndefined();

    expect(mockSendMessage).toHaveBeenCalledTimes(1);
    expect(mockSendMessage).toHaveBeenCalledWith(testMessage);
  });

  it('1回失敗してから成功する場合_再試行後に正常に完了すること', async () => {
    mockSendMessage
      .mockRejectedValueOnce(new Error('Service Worker not ready'))
      .mockResolvedValueOnce(undefined);

    const promise = sendMessageWithRetry(testMessage);

    // 最初の失敗後、タイマーを進める
    await vi.runAllTimersAsync();

    await expect(promise).resolves.toBeUndefined();

    expect(mockSendMessage).toHaveBeenCalledTimes(2);
    expect(mockSendMessage).toHaveBeenCalledWith(testMessage);
  });

  it('2回失敗してから成功する場合_再試行後に正常に完了すること', async () => {
    mockSendMessage
      .mockRejectedValueOnce(new Error('Service Worker not ready'))
      .mockRejectedValueOnce(new Error('Service Worker not ready'))
      .mockResolvedValueOnce(undefined);

    const promise = sendMessageWithRetry(testMessage);

    // 2回の失敗後、タイマーを進める
    await vi.runAllTimersAsync();

    await expect(promise).resolves.toBeUndefined();

    expect(mockSendMessage).toHaveBeenCalledTimes(3);
    expect(mockSendMessage).toHaveBeenCalledWith(testMessage);
  });

  it('3回目の再試行で失敗する場合_エラーをスローすること', async () => {
    const error = new Error('Service Worker not available');
    mockSendMessage.mockRejectedValue(error);

    const promise = sendMessageWithRetry(testMessage);

    // 最初の試行が失敗するのを待つ
    await vi.runOnlyPendingTimersAsync();

    // 2回目の再試行のタイマーを進める
    await vi.advanceTimersByTimeAsync(100);
    await vi.runOnlyPendingTimersAsync();

    // 3回目の再試行のタイマーを進める
    await vi.advanceTimersByTimeAsync(100);
    await vi.runOnlyPendingTimersAsync();

    // Promiseの拒否を適切に処理
    await expect(promise).rejects.toThrow('Service Worker not available');

    expect(mockSendMessage).toHaveBeenCalledTimes(3);
    expect(mockSendMessage).toHaveBeenCalledWith(testMessage);
  });

  it('再試行時に待機時間が正しく設定されること', async () => {
    mockSendMessage
      .mockRejectedValueOnce(new Error('Service Worker not ready'))
      .mockResolvedValueOnce(undefined);

    const promise = sendMessageWithRetry(testMessage);

    // タイマーが進められる前に、sendMessageが1回だけ呼ばれていることを確認
    expect(mockSendMessage).toHaveBeenCalledTimes(1);

    // 100ms待機（RETRY_DELAY）をシミュレート
    await vi.advanceTimersByTimeAsync(100);

    // 再試行が実行されることを確認
    expect(mockSendMessage).toHaveBeenCalledTimes(2);

    await promise;
  });

  it('ペイロードがないメッセージでも正常に動作すること', async () => {
    const messageWithoutPayload: ExtensionMessage = {
      type: ExtensionMessageType.TAB_PREV,
    };

    mockSendMessage.mockResolvedValue(undefined);

    await expect(sendMessageWithRetry(messageWithoutPayload)).resolves.toBeUndefined();

    expect(mockSendMessage).toHaveBeenCalledWith(messageWithoutPayload);
  });
});
