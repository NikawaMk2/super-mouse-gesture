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
 * 新規タブを開くジェスチャーのE2Eテスト
 */
test.describe('新規タブを開くジェスチャー', () => {
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

  test('右クリックしながら右→上方向にマウスを動かすと、新しいタブが開かれること', async () => {
    // テスト用のHTMLページを作成
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>New Tab Test</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            background-color: #f0f0f0;
          }
          h1 {
            color: #333;
          }
        </style>
      </head>
      <body>
        <h1>新規タブテストページ</h1>
        <p>このページは新規タブテスト用です。</p>
      </body>
      </html>
    `;

    // HTTPサーバーを起動
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

      // ジェスチャー実行前のタブ数を取得（ページ読み込み完了後、ジェスチャー実行直前）
      const pagesBefore = [...context.pages()];
      const tabCountBefore = pagesBefore.length;

      // 右クリックを押しながら右→上方向にマウスを動かす（RUジェスチャー）
      // 中央付近の位置で開始
      const viewportSize = page.viewportSize();
      const viewportHeight = await page.evaluate(() => window.innerHeight);
      const startX = (viewportSize?.width ?? 800) / 2;
      const startY = viewportHeight / 2;
      const moveDistance = 200; // 各方向に200px移動（MIN_GESTURE_DISTANCE以上）

      // Playwrightのmouse APIを使用して右クリックをシミュレート
      await page.mouse.move(startX, startY);
      await page.mouse.down({ button: 'right' });

      // 少し待機してから移動を開始
      await new Promise((resolve) => setTimeout(resolve, 50));

      // 右方向にマウスを動かす（複数のポイントを通過）
      const steps = 10;
      let currentX = startX;
      let currentY = startY;
      for (let i = 1; i <= steps; i++) {
        currentX = startX + (moveDistance * i) / steps;
        await page.mouse.move(currentX, currentY);
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      // 上方向にマウスを動かす（複数のポイントを通過）
      for (let i = 1; i <= steps; i++) {
        currentY = startY - (moveDistance * i) / steps;
        await page.mouse.move(currentX, currentY);
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
            div.textContent?.trim() === '新規タブ'
          );
        });
        return actionNameDiv?.textContent?.trim() ?? null;
      });
      expect(actionName).toBe('新規タブ');

      // 右クリックを離す
      await page.mouse.up({ button: 'right' });

      // 少し待機してからコンテキストメニューが抑制されたかを確認
      await new Promise((resolve) => setTimeout(resolve, 200));

      // コンテキストメニューが抑制されたことを確認
      await verifyContextMenuSuppressed(page);

      // 新しいタブが開かれるまで待機
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 新しいタブが開かれたことを確認
      const pagesAfter = [...context.pages()];
      const tabCountAfter = pagesAfter.length;
      expect(tabCountAfter).toBe(tabCountBefore + 1);

      // 新しく開かれたタブがchrome://newtab/またはchrome://new-tab-page/であることを確認
      const newPages = pagesAfter.filter((p) => !pagesBefore.includes(p));
      expect(newPages.length).toBe(1);
      
      const newPage = newPages[0];
      expect(newPage).toBeDefined();
      expect(newPage).not.toBeNull();

      const openedPage = newPage as Page;
      // MSN等の新規タブは networkidle が遅くなりうるため、load で十分
      await openedPage.waitForLoadState('load');
      const newPageUrl = openedPage.url();

      // 実行中のブラウザを判定
      const browserName = test.info().project.name;
      if (browserName === 'Microsoft Edge') {
        const isEdgeNewTab =
          newPageUrl.startsWith('edge://newtab') ||
          newPageUrl.startsWith('edge://new-tab-page') ||
          newPageUrl.startsWith('chrome-search://local-ntp') ||
          newPageUrl.startsWith('https://ntp.msn.com/edge/ntp');
        expect(
          isEdgeNewTab,
          `Expected Edge new tab URL, but got: ${newPageUrl}`
        ).toBe(true);
      } else {
        const isChromeNewTab =
          newPageUrl.startsWith('chrome://newtab') ||
          newPageUrl.startsWith('chrome://new-tab-page');
        expect(
          isChromeNewTab,
          `Expected Chrome new tab URL, but got: ${newPageUrl}`
        ).toBe(true);
      }
    } finally {
      // サーバーを閉じる
      await closeTestServer(server);
    }
  });
});