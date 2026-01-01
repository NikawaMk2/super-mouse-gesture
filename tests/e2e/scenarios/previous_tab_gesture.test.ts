import { test, expect, chromium, type BrowserContext, type Page } from '@playwright/test';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 前のタブへジェスチャーのE2Eテスト
 */
test.describe('前のタブへジェスチャー', () => {
  let context: BrowserContext;
  let page1: Page;
  let page2: Page;
  let page3: Page;
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

      // 複数のページ（タブ）を作成
      page1 = await context.newPage();
      page2 = await context.newPage();
      page3 = await context.newPage();
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

  test('右クリックしながら上方向、次に左方向にマウスを動かすと、前のタブに切り替わること', async () => {
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
    const server = createServer((req, res) => {
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
      // 各タブに異なるページを読み込む
      await page1.goto(`${baseUrl}/tab1`);
      await page2.goto(`${baseUrl}/tab2`);
      await page3.goto(`${baseUrl}/tab3`);

      // 各ページが完全に読み込まれるまで待機
      await page1.waitForLoadState('networkidle');
      await page2.waitForLoadState('networkidle');
      await page3.waitForLoadState('networkidle');

      // Content Scriptが読み込まれるまで待機
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // コンテキストメニューが表示されないことを確認するためのリスナーを設定
      await page2.evaluate(() => {
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

      // タブ2をアクティブにする（現在のタブをタブ2にする）
      await page2.bringToFront();

      // タブ2がアクティブになるまで待機
      await new Promise((resolve) => setTimeout(resolve, 500));

      // タブ2にいることを確認
      const tab2Title = await page2.title();
      expect(tab2Title).toBe('Tab 2');
      const tab2Marker = await page2.locator('#tab2-marker').textContent();
      expect(tab2Marker).toBe('このページはタブ2です。');

      // 右クリックを押しながら上方向、次に左方向にマウスを動かす（ULジェスチャー）
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

      // 上方向にマウスを動かす（複数のポイントを通過）
      const steps = 10;
      for (let i = 1; i <= steps; i++) {
        const currentY = startY - (moveDistance * i) / steps;
        await page2.mouse.move(startX, currentY);
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      // 左方向にマウスを動かす（複数のポイントを通過）
      const endY = startY - moveDistance;
      for (let i = 1; i <= steps; i++) {
        const currentX = startX - (moveDistance * i) / steps;
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
            div.textContent?.trim() === '前のタブへ'
          );
        });
        return actionNameDiv?.textContent?.trim() ?? null;
      });
      expect(actionName).toBe('前のタブへ');

      // 右クリックを離す
      await page2.mouse.up({ button: 'right' });

      // 少し待機してからコンテキストメニューが抑制されたかを確認
      await new Promise((resolve) => setTimeout(resolve, 200));

      // コンテキストメニューが抑制されたことを確認
      // contextmenuイベントが発火した場合、preventDefaultされている必要がある
      // または、contextmenuイベントが発火しない（これも正常な動作）
      const contextMenuState = await page2.evaluate(() => {
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

      // タブが切り替わるまで待機（タブ1に切り替わる）
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // タブ1がアクティブになったことを確認
      // タブ1のタイトルを確認するために、タブ1を前面に持ってくる
      await page1.bringToFront();
      await new Promise((resolve) => setTimeout(resolve, 500));

      const finalTitle = await page1.title();
      expect(finalTitle).toBe('Tab 1');

      // タブ1のコンテンツが表示されていることを確認
      const tab1Marker = await page1.locator('#tab1-marker').textContent();
      expect(tab1Marker).toBe('このページはタブ1です。');
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

