import { test, expect, chromium, type BrowserContext, type Page } from '@playwright/test';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * フルスクリーン切り替えジェスチャーのE2Eテスト
 */
test.describe('フルスクリーン切り替えジェスチャー', () => {
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

  test('右クリックしながら右→下方向にマウスを動かすと、フルスクリーンが開始されること', async () => {
    // テスト用のHTMLページを作成
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fullscreen Test</title>
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
        <h1>フルスクリーンテストページ</h1>
        <p>このページはフルスクリーンテスト用です。</p>
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

      // フルスクリーンでないことを確認
      const isFullscreenBefore = await page.evaluate(() => {
        return document.fullscreenElement !== null;
      });
      expect(isFullscreenBefore).toBe(false);

      // 右クリックを押しながら右→下方向にマウスを動かす（RDジェスチャー）
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

      // 下方向にマウスを動かす（複数のポイントを通過）
      for (let i = 1; i <= steps; i++) {
        currentY = startY + (moveDistance * i) / steps;
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
            div.textContent?.trim() === 'フルスクリーン'
          );
        });
        return actionNameDiv?.textContent?.trim() ?? null;
      });
      expect(actionName).toBe('フルスクリーン');

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

      // フルスクリーンが開始されるまで待機
      // fullscreenchangeイベントを待つ
      await page.evaluate(() => {
        return new Promise<void>((resolve) => {
          const checkFullscreen = () => {
            if (document.fullscreenElement !== null) {
              resolve();
            }
          };
          document.addEventListener('fullscreenchange', checkFullscreen, { once: true });
          // タイムアウトを設定（2秒）
          setTimeout(() => resolve(), 2000);
        });
      });

      // フルスクリーンが開始されたことを確認
      const isFullscreenAfter = await page.evaluate(() => {
        return document.fullscreenElement !== null;
      });
      expect(isFullscreenAfter).toBe(true);
    } finally {
      // フルスクリーンを解除（クリーンアップ）
      await page.evaluate(() => {
        if (document.fullscreenElement !== null) {
          document.exitFullscreen().catch(() => {
            // エラーは無視
          });
        }
      });

      // サーバーを閉じる
      server.closeAllConnections();
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
        // タイムアウトを設定（1秒）
        setTimeout(() => resolve(), 1000);
      });
    }
  });

  test('フルスクリーン状態で右クリックしながら右→下方向にマウスを動かすと、フルスクリーンが解除されること', async () => {
    // テスト用のHTMLページを作成
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fullscreen Test</title>
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
        <h1>フルスクリーンテストページ</h1>
        <p>このページはフルスクリーンテスト用です。</p>
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

      // コンテキストメニューが表示されないことを確認するためのリスナーを設定（2つ目のテストケース用）
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

      // フルスクリーンを開始
      await page.evaluate(() => {
        return document.documentElement.requestFullscreen();
      });

      // フルスクリーンが開始されるまで待機
      await page.evaluate(() => {
        return new Promise<void>((resolve) => {
          const checkFullscreen = () => {
            if (document.fullscreenElement !== null) {
              resolve();
            }
          };
          document.addEventListener('fullscreenchange', checkFullscreen, { once: true });
          // タイムアウトを設定（2秒）
          setTimeout(() => resolve(), 2000);
        });
      });

      // フルスクリーン状態であることを確認
      const isFullscreenBefore = await page.evaluate(() => {
        return document.fullscreenElement !== null;
      });
      expect(isFullscreenBefore).toBe(true);

      // 右クリックを押しながら右→下方向にマウスを動かす（RDジェスチャー）
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

      // 下方向にマウスを動かす（複数のポイントを通過）
      for (let i = 1; i <= steps; i++) {
        currentY = startY + (moveDistance * i) / steps;
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
            div.textContent?.trim() === 'フルスクリーン'
          );
        });
        return actionNameDiv?.textContent?.trim() ?? null;
      });
      expect(actionName).toBe('フルスクリーン');

      // 右クリックを離す
      await page.mouse.up({ button: 'right' });

      // 少し待機してからコンテキストメニューが抑制されたかを確認
      await new Promise((resolve) => setTimeout(resolve, 200));

      // コンテキストメニューが抑制されたことを確認
      // contextmenuイベントが発火した場合、preventDefaultされている必要がある
      // または、contextmenuイベントが発火しない（これも正常な動作）
      const contextMenuState2 = await page.evaluate(() => {
        return {
          eventFired: (window as any).__contextMenuEventFired === true,
          prevented: (window as any).__contextMenuPrevented === true,
        };
      });
      
      // contextmenuイベントが発火した場合、preventDefaultされている必要がある
      if (contextMenuState2.eventFired) {
        expect(contextMenuState2.prevented).toBe(true);
      }
      // contextmenuイベントが発火しない場合も正常（ジェスチャが正常に動作している）

      // フルスクリーンが解除されるまで待機
      // fullscreenchangeイベントを待つ
      await page.evaluate(() => {
        return new Promise<void>((resolve) => {
          const checkFullscreen = () => {
            if (document.fullscreenElement === null) {
              resolve();
            }
          };
          document.addEventListener('fullscreenchange', checkFullscreen, { once: true });
          // タイムアウトを設定（2秒）
          setTimeout(() => resolve(), 2000);
        });
      });

      // フルスクリーンが解除されたことを確認
      const isFullscreenAfter = await page.evaluate(() => {
        return document.fullscreenElement === null;
      });
      expect(isFullscreenAfter).toBe(true);
    } finally {
      // フルスクリーンを解除（クリーンアップ）
      await page.evaluate(() => {
        if (document.fullscreenElement !== null) {
          document.exitFullscreen().catch(() => {
            // エラーは無視
          });
        }
      });

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

