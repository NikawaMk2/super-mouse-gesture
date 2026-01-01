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
 * ページトップへスクロールジェスチャーのE2Eテスト
 */
test.describe('ページトップへスクロールジェスチャー', () => {
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

  test('右クリックしながら下方向、その後上方向にマウスを動かすと、ページがトップへスクロールすること', async () => {
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

    // ページを下にスクロール（テストの前提条件として、下にスクロールできる状態にする）
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    await page.evaluate((height: number) => {
      window.scrollBy({ top: height * 2, behavior: 'instant' });
    }, viewportHeight);

    // スクロール完了を待機
    await new Promise((resolve) => setTimeout(resolve, 500));

    // スクロール後の位置を確認（下にスクロールされていることを確認）
    const scrollYBeforeGesture = await page.evaluate(() => window.scrollY);
    expect(scrollYBeforeGesture).toBeGreaterThan(0);

    // 右クリックを押しながら下方向、その後上方向にマウスを動かす（DUジェスチャー）
    // 中央付近の位置で開始
    const viewportSize = page.viewportSize();
    const startX = (viewportSize?.width ?? 800) / 2;
    const startY = viewportHeight / 2;
    const moveDistance = 200; // 各方向に200px移動（MIN_GESTURE_DISTANCE以上）

    // Playwrightのmouse APIを使用して右クリックをシミュレート
    await page.mouse.move(startX, startY);
    await page.mouse.down({ button: 'right' });

    // 少し待機してから移動を開始
    await new Promise((resolve) => setTimeout(resolve, 50));

    // まず下方向にマウスを動かす（複数のポイントを通過）
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      const currentY = startY + (moveDistance * i) / steps;
      await page.mouse.move(startX, currentY);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    // 下方向移動後の位置を保持
    const middleY = startY + moveDistance;

    // 少し待機してから上方向に移動
    await new Promise((resolve) => setTimeout(resolve, 50));

    // 上方向にマウスを動かす（複数のポイントを通過）
    // 最終位置はstartYより少し上に留める（距離チェックに引っかからないようにするため）
    for (let i = 1; i <= steps; i++) {
      const currentY = middleY - (moveDistance * i) / steps;
      await page.mouse.move(startX, currentY);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    
    // 最後に少し上に移動して、開始位置より上に留める
    const finalY = startY - moveDistance / 2;
    await page.mouse.move(startX, finalY);
    await new Promise((resolve) => setTimeout(resolve, 20));

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
          div.textContent?.trim() === 'ページトップへ'
        );
      });
      return actionNameDiv?.textContent?.trim() ?? null;
    });
    expect(actionName).toBe('ページトップへ');

    // アクション名が表示されるまで少し待機
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 右クリックを離す
    await page.mouse.up({ button: 'right' });

    // 少し待機してからコンテキストメニューが抑制されたかを確認
    await new Promise((resolve) => setTimeout(resolve, 200));

    // コンテキストメニューが抑制されたことを確認
    await verifyContextMenuSuppressed(page);

    // スクロールが完了するまで待機
    // scrollTo({ top: 0, behavior: 'auto' }) は即座にスクロールするが、念のため少し待機
    await new Promise((resolve) => setTimeout(resolve, 500));

    // スクロール後の位置を確認（トップ（scrollY = 0）までスクロールされていることを確認）
    const scrollYAfterGesture = await page.evaluate(() => window.scrollY);
    expect(scrollYAfterGesture).toBe(0);
    } finally {
      // サーバーを閉じる
      await closeTestServer(server);
    }
  });
});

