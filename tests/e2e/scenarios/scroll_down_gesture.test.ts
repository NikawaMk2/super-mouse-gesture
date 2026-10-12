import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import {
  getExtensionPath,
  createBrowserContext,
  createPage,
  createTestServer,
  closeTestServer,
  waitForPageLoad,
  setupContextMenuListener,
  verifyContextMenuSuppressed,
} from '../helpers/test-setup';

/**
 * 下へスクロールジェスチャーのE2Eテスト
 */
test.describe('下へスクロールジェスチャー', () => {
  let context: BrowserContext;
  let page: Page;
  const extensionPath = getExtensionPath(import.meta.url);

  test.beforeAll(async () => {
    context = await createBrowserContext(extensionPath);
    page = await createPage(context);
  });

  test.afterAll(async () => {
    // contextが正常に作成された場合のみクリーンアップ
    if (context) {
      await context.close();
    }
  });

  test('右クリックしながら下方向にマウスを動かすと、ページが下にスクロールすること', async () => {
    // スクロール可能なHTMLページを作成
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Scroll Test</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            height: 100vh;
            overflow-y: auto;
          }
          .content {
            height: 3000px;
            background: linear-gradient(to bottom, #ff0000 0%, #00ff00 50%, #0000ff 100%);
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <div class="content">
          <h1>スクロールテストページ</h1>
          <p>このページはスクロール可能です。</p>
          <div style="margin-top: 1000px;">
            <p>中央付近のコンテンツ</p>
          </div>
          <div style="margin-top: 1000px;">
            <p>下部のコンテンツ</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // URLではContent Scriptが読み込まれない可能性があるため、HTTPサーバーを起動してContent Scriptが読み込まれるようにする
    const { server, baseUrl: url } = await createTestServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(htmlContent);
    });

    try {
      // HTTP URLとしてページを読み込む
      await page.goto(url);

      // ページが完全に読み込まれるまで待機
      await waitForPageLoad(page);

      // コンテキストメニューが表示されないことを確認するためのリスナーを設定
      await setupContextMenuListener(page);

    // 初期スクロール位置を確認（最上部であることを確認）
    const initialScrollY = await page.evaluate(() => window.scrollY);
    expect(initialScrollY).toBe(0);

    // ページを少し下にスクロール（テストの前提条件として、下にスクロールできる状態にする）
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    await page.evaluate((height: number) => {
      window.scrollBy({ top: height * 0.5, behavior: 'instant' });
    }, viewportHeight);

    // スクロール完了を待機
    await new Promise((resolve) => setTimeout(resolve, 500));

    // スクロール後の位置を確認（下にスクロールされていることを確認）
    const scrollYBeforeGesture = await page.evaluate(() => window.scrollY);
    expect(scrollYBeforeGesture).toBeGreaterThan(0);

    // 右クリックを押しながら下方向にマウスを動かす（ジェスチャー）
    // 中央付近の位置で開始
    const viewportSize = page.viewportSize();
    const startX = (viewportSize?.width ?? 800) / 2;
    const startY = viewportHeight / 2;
    const moveDistance = 200; // 下方向に200px移動（MIN_GESTURE_DISTANCE以上）

    // Playwrightのmouse APIを使用して右クリックをシミュレート
    await page.mouse.move(startX, startY);
    await page.mouse.down({ button: 'right' });

    // 少し待機してから移動を開始
    await new Promise((resolve) => setTimeout(resolve, 50));

    // 下方向にマウスを動かす（複数のポイントを通過）
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      const currentY = startY + (moveDistance * i) / steps;
      await page.mouse.move(startX, currentY);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    // 少し待機してからmouseup
    await new Promise((resolve) => setTimeout(resolve, 50));

    // トレイルが表示されていることを確認
    const trailCanvas = await page.evaluate(() => {
      const canvas = document.querySelector('canvas[style*="position: fixed"]');
      return canvas !== null;
    });
    expect(trailCanvas).toBe(true);

    // アクション名が表示されていることを確認
    const actionName = await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('div'));
      const actionNameDiv = divs.find((div) => {
        const style = window.getComputedStyle(div);
        return (
          style.position === 'fixed' &&
          style.zIndex === '2147483647' &&
          div.textContent?.trim() === '下へスクロール'
        );
      });
      return actionNameDiv?.textContent?.trim() ?? null;
    });
    expect(actionName).toBe('下へスクロール');

    // 右クリックを離す
    await page.mouse.up({ button: 'right' });

    // 少し待機してからコンテキストメニューが抑制されたかを確認
    await new Promise((resolve) => setTimeout(resolve, 200));

    // コンテキストメニューが抑制されたことを確認
    await verifyContextMenuSuppressed(page);

    // スクロールアニメーションが完了するまで待機
    // smoothスクロールの場合、スクロール位置が変化し、その後安定するまで待機
    // まず、スクロールが開始されたかどうかを確認
    await page.waitForFunction(
      (beforeScrollY: number) => {
        const currentScrollY = window.scrollY;
        // スクロール位置が変化したことを確認
        return currentScrollY > beforeScrollY;
      },
      scrollYBeforeGesture,
      { timeout: 2000 }
    );

    // スクロールアニメーションが完全に完了するまで待機
    // smoothスクロールのアニメーション時間を考慮（通常500-1000ms）
    // スクロール位置が安定するまで待機（連続して同じ値が2回確認されるまで）
    let lastScrollY = await page.evaluate(() => window.scrollY);
    let stableCount = 0;
    const maxWaitIterations = 15; // 最大1.5秒
    for (let i = 0; i < maxWaitIterations; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const currentScrollY = await page.evaluate(() => window.scrollY);
      if (currentScrollY === lastScrollY) {
        stableCount++;
        if (stableCount >= 2) {
          // スクロール位置が安定した
          break;
        }
      } else {
        stableCount = 0;
        lastScrollY = currentScrollY;
      }
    }

    // スクロール後の位置を確認（下にスクロールされていることを確認）
    const scrollYAfterGesture = await page.evaluate(() => window.scrollY);
    expect(scrollYAfterGesture).toBeGreaterThan(scrollYBeforeGesture);
    expect(scrollYAfterGesture).toBeGreaterThanOrEqual(0);
    } finally {
      // サーバーを閉じる
      await closeTestServer(server);
    }
  });
});

