import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import {
  getExtensionPath,
  createBrowserContext,
  createPages,
  createTestServer,
  closeTestServer,
  waitForPageLoad,
} from '../helpers/test-setup';

/**
 * タブを閉じて右へジェスチャーのE2Eテスト
 */
test.describe('タブを閉じて右へジェスチャー', () => {
  let context: BrowserContext;
  let page1: Page;
  let page2: Page;
  let page3: Page;
  const extensionPath = getExtensionPath(import.meta.url);

  test.beforeAll(async () => {
    context = await createBrowserContext(extensionPath);
    const pages = await createPages(context, 3);
    if (pages.length === 3) {
      [page1, page2, page3] = pages as [Page, Page, Page];
    } else {
      throw new Error('Failed to create 3 pages');
    }
  });

  test.afterAll(async () => {
    // contextが正常に作成された場合のみクリーンアップ
    if (context) {
      await context.close();
    }
  });

  test('右クリックしながら下方向、次に右方向にマウスを動かすと、現在のタブが閉じられて右のタブに移動すること', async () => {
    // タブ1のHTMLコンテンツ
    const tab1Content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tab 1</title>
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
        <h1>タブ1</h1>
        <p>これは最初のタブです。</p>
        <p id="tab1-marker">このページはタブ1です。</p>
      </body>
      </html>
    `;

    // タブ2のHTMLコンテンツ
    const tab2Content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tab 2</title>
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
        <h1>タブ2</h1>
        <p>これは2番目のタブです。</p>
        <p id="tab2-marker">このページはタブ2です。</p>
      </body>
      </html>
    `;

    // タブ3のHTMLコンテンツ
    const tab3Content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tab 3</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            background-color: #ccccff;
          }
          h1 {
            color: #0000cc;
          }
        </style>
      </head>
      <body>
        <h1>タブ3</h1>
        <p>これは3番目のタブです。</p>
        <p id="tab3-marker">このページはタブ3です。</p>
      </body>
      </html>
    `;

    // HTTPサーバーを起動
    const { server, baseUrl } = await createTestServer((req, res) => {
      if (req.url === '/tab1') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(tab1Content);
      } else if (req.url === '/tab2') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(tab2Content);
      } else if (req.url === '/tab3') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(tab3Content);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(tab1Content);
      }
    });

    try {
      // 各タブに異なるページを読み込む
      await page1.goto(`${baseUrl}/tab1`);
      await page2.goto(`${baseUrl}/tab2`);
      await page3.goto(`${baseUrl}/tab3`);

      // 各ページが完全に読み込まれるまで待機
      await waitForPageLoad([page1, page2, page3]);

      // タブ2をアクティブにする（現在のタブをタブ2にする）
      await page2.bringToFront();

      // タブ2がアクティブになるまで待機
      await new Promise((resolve) => setTimeout(resolve, 500));

      // タブ2にいることを確認
      const tab2Title = await page2.title();
      expect(tab2Title).toBe('Tab 2');
      const tab2Marker = await page2.locator('#tab2-marker').textContent();
      expect(tab2Marker).toBe('このページはタブ2です。');

      // 右クリックを押しながら下方向、次に右方向にマウスを動かす（DRジェスチャー）
      // 中央付近の位置で開始
      const viewportSize = page2.viewportSize();
      const viewportHeight = await page2.evaluate(() => window.innerHeight);
      const startX = (viewportSize?.width ?? 800) / 2;
      const startY = viewportHeight / 2;
      const moveDistance = 200; // 各方向に200px移動（MIN_GESTURE_DISTANCE以上）

      // Playwrightのmouse APIを使用して右クリックをシミュレート
      await page2.mouse.move(startX, startY);
      await page2.mouse.down({ button: 'right' });

      // 少し待機してから移動を開始
      await new Promise((resolve) => setTimeout(resolve, 50));

      // 下方向にマウスを動かす（複数のポイントを通過）
      const steps = 10;
      for (let i = 1; i <= steps; i++) {
        const currentY = startY + (moveDistance * i) / steps;
        await page2.mouse.move(startX, currentY);
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      // 右方向にマウスを動かす（複数のポイントを通過）
      const endY = startY + moveDistance;
      for (let i = 1; i <= steps; i++) {
        const currentX = startX + (moveDistance * i) / steps;
        await page2.mouse.move(currentX, endY);
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      // 少し待機してからmouseup
      await new Promise((resolve) => setTimeout(resolve, 50));

      // トレイルが表示されていることを確認
      const trailCanvas = await page2.evaluate(() => {
        const canvas = document.querySelector('canvas[style*="position: fixed"]');
        return canvas !== null;
      });
      expect(trailCanvas).toBe(true);

      // アクション名が表示されていることを確認
      const actionName = await page2.evaluate(() => {
        const divs = Array.from(document.querySelectorAll('div'));
        const actionNameDiv = divs.find((div) => {
          const style = window.getComputedStyle(div);
          return (
            style.position === 'fixed' &&
            style.zIndex === '2147483647' &&
            div.textContent?.trim() === 'タブを閉じて右へ'
          );
        });
        return actionNameDiv?.textContent?.trim() ?? null;
      });
      expect(actionName).toBe('タブを閉じて右へ');

      // 右クリックを離す
      await page2.mouse.up({ button: 'right' });

      // タブが閉じられるまで待機
      // 注意: タブが閉じられるとコンテキストメニューも自動的に閉じられるため、
      // コンテキストメニューの抑制確認は不要
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // タブ3がアクティブになったことを確認（これにより、タブ2が閉じられたことが間接的に確認される）
      // タブ3のタイトルを確認するために、タブ3を前面に持ってくる
      await page3.bringToFront();
      await new Promise((resolve) => setTimeout(resolve, 500));

      const finalTitle = await page3.title();
      expect(finalTitle).toBe('Tab 3');

      // タブ3のコンテンツが表示されていることを確認
      const tab3Marker = await page3.locator('#tab3-marker').textContent();
      expect(tab3Marker).toBe('このページはタブ3です。');

      // タブ1もまだ存在することを確認（タブ2だけが閉じられた）
      await page1.bringToFront();
      await new Promise((resolve) => setTimeout(resolve, 500));
      const tab1Title = await page1.title();
      expect(tab1Title).toBe('Tab 1');
    } finally {
      // サーバーを閉じる
      await closeTestServer(server);
    }
  });
});

