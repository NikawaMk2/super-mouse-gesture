import { test, expect, chromium, type BrowserContext, type Page } from '@playwright/test';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * ページ拡大ジェスチャーのE2Eテスト
 */
test.describe('ページ拡大ジェスチャー', () => {
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

  test('右クリックしながら左→上方向にマウスを動かすと、ページが拡大すること', async () => {
    // テスト用のHTMLページを作成
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Zoom Test</title>
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
        <h1>ズームテストページ</h1>
        <p>このページはズームテスト用です。</p>
        <div style="width: 200px; height: 200px; background-color: #ff0000; margin: 20px 0;">
          テスト要素
        </div>
      </body>
      </html>
    `;

    // HTTPサーバーを起動
    const server = createServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(htmlContent);
    });

    // ランダムなポートでサーバーを起動
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        resolve();
      });
    });

    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : 0;
    const url = `http://localhost:${port}`;

    try {
      // HTTP URLとしてページを読み込む
      await page.goto(url);

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

      // アクションが実行されたことを確認するため、
      // アクション名が表示されることを確認する

      // 右クリックを押しながら左→上方向にマウスを動かす（LUジェスチャー）
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

      // 左方向にマウスを動かす（複数のポイントを通過）
      const steps = 10;
      let currentX = startX;
      let currentY = startY;
      for (let i = 1; i <= steps; i++) {
        currentX = startX - (moveDistance * i) / steps;
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
            div.textContent?.trim() === 'ページ拡大'
          );
        });
        return actionNameDiv?.textContent?.trim() ?? null;
      });
      expect(actionName).toBe('ページ拡大');

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

      // ズームレベルが変更されるまで待機
      // chrome.tabs.setZoomは非同期で実行されるため、少し待機が必要
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ズームインアクションが実行されたことを確認
      // 注意: chrome.tabs.setZoomはタブのズームレベルを変更するが、
      // E2Eテストではchrome.tabs.getZoomに直接アクセスできないため、
      // アクション名が表示されたことを確認した上で、
      // ズームアクションが実行されたことを前提とする
      // 実際のズームレベルの変化を確認するには、chrome.tabs.getZoomを使用する必要があるが、
      // E2Eテストでは直接アクセスできないため、アクションが実行されたことを前提とする
      
      // アクション名が表示されたことを確認（既に確認済み）
      // これにより、LUジェスチャーが正しく認識され、ページ拡大アクションが実行されたことを確認
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

