import { test, expect, chromium, type BrowserContext, type Page } from '@playwright/test';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 再読み込みジェスチャーのE2Eテスト
 */
test.describe('再読み込みジェスチャー', () => {
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

  test('右クリックしながら左から右方向にマウスを動かすと、ページが再読み込みされること', async () => {
    // ページのHTMLコンテンツ（読み込み回数を表示）
    const pageContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reload Test Page</title>
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
        <script>
          // ページが読み込まれるたびにカウントを増やす
          // sessionStorageを使用して、再読み込み後もカウントを保持
          (function() {
            let loadCount = parseInt(sessionStorage.getItem('reloadTestCount') || '0', 10);
            loadCount++;
            sessionStorage.setItem('reloadTestCount', loadCount.toString());
            
            // デバッグ用: コンソールにログを出力
            console.log('ページ読み込み:', loadCount);
            
            // 即座に表示を更新
            function updateDisplay() {
              const loadCountEl = document.getElementById('load-count');
              const timestampEl = document.getElementById('timestamp');
              if (loadCountEl) {
                loadCountEl.textContent = loadCount.toString();
              }
              if (timestampEl) {
                timestampEl.textContent = new Date().toISOString();
              }
            }
            
            // DOMContentLoadedイベントで表示を更新
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', updateDisplay);
            } else {
              // 既に読み込まれている場合
              updateDisplay();
            }
          })();
        </script>
      </head>
      <body>
        <h1>再読み込みテストページ</h1>
        <p>このページは再読み込みテスト用です。</p>
        <p>読み込み回数: <span id="load-count">0</span></p>
        <p>最終読み込み時刻: <span id="timestamp">-</span></p>
        <p id="page-marker">このページは再読み込みテストページです。</p>
      </body>
      </html>
    `;

    // HTTPサーバーを起動
    const server = createServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(pageContent);
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
      // ページに移動
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

      // ページが読み込まれたことを確認
      const initialTitle = await page.title();
      expect(initialTitle).toBe('Reload Test Page');

      // 最初の読み込み回数を取得
      // sessionStorageを使用しているため、最初は1になる
      const initialLoadCount = await page.locator('#load-count').textContent();
      expect(initialLoadCount).toBe('1');

      // 最初のタイムスタンプを取得
      const initialTimestamp = await page.locator('#timestamp').textContent();
      expect(initialTimestamp).not.toBe('-');

      // 少し待機してから再読み込みを実行（タイムスタンプが変わることを確認するため）
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 右クリックを押しながら左から右方向にマウスを動かす（ジェスチャー）
      // LRジェスチャー: まず左方向に動いてから右方向に動く
      const viewportSize = page.viewportSize();
      const viewportHeight = await page.evaluate(() => window.innerHeight);
      const centerX = (viewportSize?.width ?? 800) / 2;
      const startX = centerX; // 中央から開始
      const startY = viewportHeight / 2;
      const leftMoveDistance = 150; // 左方向に150px移動（THRESHOLD=30px以上）
      const rightMoveDistance = 200; // 右方向に200px移動（THRESHOLD=30px以上）

      // Playwrightのmouse APIを使用して右クリックをシミュレート
      await page.mouse.move(startX, startY);
      await page.mouse.down({ button: 'right' });

      // 少し待機してから移動を開始
      await new Promise((resolve) => setTimeout(resolve, 50));

      // まず左方向にマウスを動かす（L方向を検出）
      const leftSteps = 10;
      for (let i = 1; i <= leftSteps; i++) {
        const currentX = startX - (leftMoveDistance * i) / leftSteps;
        await page.mouse.move(currentX, startY);
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      // 左端の位置
      const leftX = startX - leftMoveDistance;

      // 次に右方向にマウスを動かす（R方向を検出）
      const rightSteps = 10;
      for (let i = 1; i <= rightSteps; i++) {
        const currentX = leftX + (rightMoveDistance * i) / rightSteps;
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
            div.textContent?.trim() === '再読み込み'
          );
        });
        return actionNameDiv?.textContent?.trim() ?? null;
      });
      expect(actionName).toBe('再読み込み');

      // 再読み込みを待機するPromiseを作成
      const reloadPromise = page.waitForLoadState('load', { timeout: 10000 });

      // 右クリックを離す（再読み込みが実行される）
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

      // ページが再読み込みされるまで待機
      await reloadPromise;

      // ページが完全に読み込まれるまで待機
      await page.waitForLoadState('networkidle', { timeout: 10000 });

      // Content Scriptが読み込まれるまで待機
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ページが再読み込みされたことを確認（読み込み回数が2になっている）
      const finalLoadCount = await page.locator('#load-count').textContent();
      expect(finalLoadCount).toBe('2');
      
      // sessionStorageから直接読み込み回数を確認
      const storedCount = await page.evaluate(() => {
        return sessionStorage.getItem('reloadTestCount');
      });
      
      // sessionStorageの値も確認
      if (storedCount) {
        const count = parseInt(storedCount, 10);
        expect(count).toBeGreaterThanOrEqual(2);
      }

      // ページのコンテンツが正しく表示されていることを確認
      const pageMarker = await page.locator('#page-marker').textContent();
      expect(pageMarker).toBe('このページは再読み込みテストページです。');

      // タイトルが変わっていないことを確認
      const finalTitle = await page.title();
      expect(finalTitle).toBe('Reload Test Page');
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


