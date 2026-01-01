import { test, expect, chromium, type BrowserContext, type Page } from '@playwright/test';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 進むジェスチャーのE2Eテスト
 */
test.describe('進むジェスチャー', () => {
  let context: BrowserContext;
  let page: Page;
  const extensionPath = resolve(__dirname, '../../../dist');

  test.beforeAll(async () => {
    // Chrome拡張機能を読み込んだコンテキストを作成
    try {
      context = await chromium.launchPersistentContext('', {
        headless: false,
        args: [
          `--disable-extensions-except=${extensionPath}`,
          `--load-extension=${extensionPath}`,
        ],
      });

      // 拡張機能が読み込まれるまで待機
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 新しいページを作成
      page = await context.newPage();
    } catch (error) {
      console.error('ブラウザコンテキストの作成に失敗しました:', error);
      throw error;
    }
  });

  test.afterAll(async () => {
    // contextが正常に作成された場合のみクリーンアップ
    if (context) {
      await context.close();
    }
  });

  test('右クリックしながら右方向にマウスを動かすと、ブラウザの履歴が進むこと', async () => {
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
        <p id="page1-marker">このページはページ1です。</p>
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
    const server = createServer((req, res) => {
      if (req.url === '/page2') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(page2Content);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(page1Content);
      }
    });

    // ランダムなポートでサーバーを起動
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        resolve();
      });
    });

    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : 0;
    const baseUrl = `http://localhost:${port}`;

    try {
      // 最初のページ（ページ1）に移動
      await page.goto(baseUrl);

      // ページが完全に読み込まれるまで待機
      await page.waitForLoadState('networkidle');

      // Content Scriptが読み込まれるまで待機
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // コンテキストメニューが表示されないことを確認するためのリスナーを設定
      await page.evaluate(() => {
        // contextmenuイベントリスナーを追加して、preventDefaultが呼ばれているかを確認
        (window as any).__contextMenuEventFired = false;
        (window as any).__contextMenuPrevented = false;
        document.addEventListener(
          'contextmenu',
          (e) => {
            (window as any).__contextMenuEventFired = true;
            // preventDefaultが呼ばれている場合、defaultPreventedがtrueになる
            if (e.defaultPrevented) {
              (window as any).__contextMenuPrevented = true;
            }
          },
          true
        );
      });

      // ページ1にいることを確認
      const page1Title = await page.title();
      expect(page1Title).toBe('Page 1');

      // ページ2に移動
      await page.click('#link-to-page2');

      // ページが完全に読み込まれるまで待機
      await page.waitForLoadState('networkidle');

      // Content Scriptが読み込まれるまで待機
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ページ2にいることを確認
      const page2Title = await page.title();
      expect(page2Title).toBe('Page 2');
      const page2Marker = await page.locator('#page2-marker').textContent();
      expect(page2Marker).toBe('このページはページ2です。');

      // 戻る操作を実行して、進む履歴を作成する
      await page.goBack();

      // ページが完全に読み込まれるまで待機
      await page.waitForLoadState('networkidle');

      // Content Scriptが読み込まれるまで待機
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ページ1に戻ったことを確認
      const backTitle = await page.title();
      expect(backTitle).toBe('Page 1');
      const page1Marker = await page.locator('#page1-marker').textContent();
      expect(page1Marker).toBe('このページはページ1です。');

      // 右クリックを押しながら右方向にマウスを動かす（ジェスチャー）
      // 中央付近の位置で開始
      const viewportSize = page.viewportSize();
      const viewportHeight = await page.evaluate(() => window.innerHeight);
      const startX = (viewportSize?.width ?? 800) / 2;
      const startY = viewportHeight / 2;
      const moveDistance = 200; // 右方向に200px移動（MIN_GESTURE_DISTANCE以上）

      // Playwrightのmouse APIを使用して右クリックをシミュレート
      await page.mouse.move(startX, startY);
      await page.mouse.down({ button: 'right' });

      // 少し待機してから移動を開始
      await new Promise((resolve) => setTimeout(resolve, 50));

      // 右方向にマウスを動かす（複数のポイントを通過）
      const steps = 10;
      for (let i = 1; i <= steps; i++) {
        const currentX = startX + (moveDistance * i) / steps;
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
            div.textContent?.trim() === '進む'
          );
        });
        return actionNameDiv?.textContent?.trim() ?? null;
      });
      expect(actionName).toBe('進む');

      // 右クリックを離す
      await page.mouse.up({ button: 'right' });

      // 少し待機してからコンテキストメニューが抑制されたかを確認
      await new Promise((resolve) => setTimeout(resolve, 200));

      // コンテキストメニューが抑制されたことを確認
      // contextmenuイベントが発火した場合、preventDefaultされている必要がある
      // または、contextmenuイベントが発火しない（これも正常な動作）
      const contextMenuState = await page.evaluate(() => {
        return {
          eventFired: (window as any).__contextMenuEventFired === true,
          prevented: (window as any).__contextMenuPrevented === true,
        };
      });
      
      // contextmenuイベントが発火した場合、preventDefaultされている必要がある
      if (contextMenuState.eventFired) {
        expect(contextMenuState.prevented).toBe(true);
      }
      // contextmenuイベントが発火しない場合も正常（ジェスチャが正常に動作している）

      // ページが進むまで待機（ページ2に進む）
      await page.waitForFunction(
        () => {
          return document.title === 'Page 2';
        },
        { timeout: 3000 }
      );

      // ページ2に進んだことを確認
      const finalTitle = await page.title();
      expect(finalTitle).toBe('Page 2');

      // ページ2のコンテンツが表示されていることを確認
      const page2ContentFinal = await page.locator('h1').textContent();
      expect(page2ContentFinal).toBe('ページ2');
    } finally {
      // サーバーを閉じる
      server.closeAllConnections();
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
        // タイムアウトを設定（1秒）
        setTimeout(() => resolve(), 1000);
      });
    }
  });
});

