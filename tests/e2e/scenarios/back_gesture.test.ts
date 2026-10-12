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
 * 戻るジェスチャーのE2Eテスト
 */
test.describe('戻るジェスチャー', () => {
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

  test('右クリックしながら左方向にマウスを動かすと、ブラウザの履歴が戻ること', async () => {
    // 最初のページのHTMLコンテンツ
    const page1Content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Page 1</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            background-color: #ffcccc;
          }
          h1 {
            color: #cc0000;
          }
        </style>
      </head>
      <body>
        <h1>ページ1</h1>
        <p>これは最初のページです。</p>
        <a href="/page2" id="link-to-page2">ページ2へ移動</a>
      </body>
      </html>
    `;

    // 2番目のページのHTMLコンテンツ
    const page2Content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Page 2</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            background-color: #ccffcc;
          }
          h1 {
            color: #00cc00;
          }
        </style>
      </head>
      <body>
        <h1>ページ2</h1>
        <p>これは2番目のページです。</p>
        <p id="page2-marker">このページはページ2です。</p>
      </body>
      </html>
    `;

    // HTTPサーバーを起動
    const { server, baseUrl } = await createTestServer((req, res) => {
      if (req.url === '/page2') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(page2Content);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(page1Content);
      }
    });

    try {
      // 最初のページ（ページ1）に移動
      await page.goto(baseUrl);

      // ページが完全に読み込まれるまで待機
      await waitForPageLoad(page);

      // コンテキストメニューが表示されないことを確認するためのリスナーを設定
      await setupContextMenuListener(page);

      // ページ1にいることを確認
      const page1Title = await page.title();
      expect(page1Title).toBe('Page 1');

      // ページ2に移動
      await page.click('#link-to-page2');

      // ページが完全に読み込まれるまで待機
      await waitForPageLoad(page);

      // ページ2にいることを確認
      const page2Title = await page.title();
      expect(page2Title).toBe('Page 2');
      const page2Marker = await page.locator('#page2-marker').textContent();
      expect(page2Marker).toBe('このページはページ2です。');

      // 右クリックを押しながら左方向にマウスを動かす（ジェスチャー）
      // 中央付近の位置で開始
      const viewportSize = page.viewportSize();
      const viewportHeight = await page.evaluate(() => window.innerHeight);
      const startX = (viewportSize?.width ?? 800) / 2;
      const startY = viewportHeight / 2;
      const moveDistance = 200; // 左方向に200px移動（MIN_GESTURE_DISTANCE以上）

      // Playwrightのmouse APIを使用して右クリックをシミュレート
      await page.mouse.move(startX, startY);
      await page.mouse.down({ button: 'right' });

      // 少し待機してから移動を開始
      await new Promise((resolve) => setTimeout(resolve, 50));

      // 左方向にマウスを動かす（複数のポイントを通過）
      const steps = 10;
      for (let i = 1; i <= steps; i++) {
        const currentX = startX - (moveDistance * i) / steps;
        await page.mouse.move(currentX, startY);
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
            div.textContent?.trim() === '戻る'
          );
        });
        return actionNameDiv?.textContent?.trim() ?? null;
      });
      expect(actionName).toBe('戻る');

      // 右クリックを離す
      await page.mouse.up({ button: 'right' });

      // 少し待機してからコンテキストメニューが抑制されたかを確認
      await new Promise((resolve) => setTimeout(resolve, 200));

      // コンテキストメニューが抑制されたことを確認
      await verifyContextMenuSuppressed(page);

      // ページが戻るまで待機（ページ1に戻る）
      await page.waitForFunction(
        () => {
          return document.title === 'Page 1';
        },
        { timeout: 3000 }
      );

      // ページ1に戻ったことを確認
      const finalTitle = await page.title();
      expect(finalTitle).toBe('Page 1');

      // ページ1のコンテンツが表示されていることを確認
      const page1Content = await page.locator('h1').textContent();
      expect(page1Content).toBe('ページ1');
    } finally {
      // サーバーを閉じる
      await closeTestServer(server);
    }
  });
});

