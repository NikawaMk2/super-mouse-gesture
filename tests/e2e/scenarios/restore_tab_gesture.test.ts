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
 * 閉じたタブを開くジェスチャーのE2Eテスト
 */
test.describe('閉じたタブを開くジェスチャー', () => {
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

  test('右クリックしながら右から左方向にマウスを動かすと、閉じたタブが開かれること', async () => {
    // テスト用のHTMLページを作成
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Restore Tab Test</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            background-color: #ffffcc;
          }
          h1 {
            color: #cc9900;
          }
        </style>
      </head>
      <body>
        <h1>タブ復元テストページ</h1>
        <p>このページはタブ復元テスト用です。</p>
        <p id="page-marker">このページはタブ復元テストページです。</p>
      </body>
      </html>
    `;

    // HTTPサーバーを起動
    const { server, baseUrl: url } = await createTestServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(htmlContent);
    });

    try {
      // ページに移動
      await page.goto(url);

      // ページが完全に読み込まれるまで待機
      await waitForPageLoad(page);

      // ページが読み込まれたことを確認
      const initialTitle = await page.title();
      expect(initialTitle).toBe('Restore Tab Test');

      const pageMarker = await page.locator('#page-marker').textContent();
      expect(pageMarker).toBe('このページはタブ復元テストページです。');

      // ページのURLを保存（復元後に確認するため）
      const originalUrl = page.url();

      // タブを閉じる
      await page.close();

      // タブが閉じられるまで待機
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 新しいページを作成（タブを閉じた後、別のタブが必要）
      // HTTP URLを使用してContent Scriptが読み込まれるようにする
      const newPageContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>New Page for Gesture</title>
        </head>
        <body>
          <h1>ジェスチャー実行用ページ</h1>
        </body>
        </html>
      `;
      const { server: newPageServer, baseUrl: newPageUrl } = await createTestServer((_req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(newPageContent);
      });

      const newPage = await context.newPage();
      await newPage.goto(newPageUrl);
      await waitForPageLoad(newPage);

      // コンテキストメニューが表示されないことを確認するためのリスナーを設定
      await setupContextMenuListener(newPage);

      // 新しいページを作成した後のタブ数を取得（復元されたタブを識別するため）
      const pagesAfterNewPage = context.pages();

      // 右クリックを押しながら右から左方向にマウスを動かす（RLジェスチャー）
      // 中央付近の位置で開始
      const viewportSize = newPage.viewportSize();
      const viewportHeight = await newPage.evaluate(() => window.innerHeight);
      const centerX = (viewportSize?.width ?? 800) / 2;
      const startX = centerX; // 中央から開始
      const startY = viewportHeight / 2;
      const rightMoveDistance = 150; // 右方向に150px移動（THRESHOLD=30px以上）
      const leftMoveDistance = 200; // 左方向に200px移動（THRESHOLD=30px以上）

      // Playwrightのmouse APIを使用して右クリックをシミュレート
      await newPage.mouse.move(startX, startY);
      await newPage.mouse.down({ button: 'right' });

      // 少し待機してから移動を開始
      await new Promise((resolve) => setTimeout(resolve, 50));

      // まず右方向にマウスを動かす（R方向を検出）
      const rightSteps = 10;
      for (let i = 1; i <= rightSteps; i++) {
        const currentX = startX + (rightMoveDistance * i) / rightSteps;
        await newPage.mouse.move(currentX, startY);
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      // 右端の位置
      const rightX = startX + rightMoveDistance;

      // 次に左方向にマウスを動かす（L方向を検出）
      const leftSteps = 10;
      for (let i = 1; i <= leftSteps; i++) {
        const currentX = rightX - (leftMoveDistance * i) / leftSteps;
        await newPage.mouse.move(currentX, startY);
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      // 少し待機してからmouseup
      await new Promise((resolve) => setTimeout(resolve, 50));

      // トレイルが表示されていることを確認
      const trailCanvas = await newPage.evaluate(() => {
        const canvas = document.querySelector('canvas[style*="position: fixed"]');
        return canvas !== null;
      });
      expect(trailCanvas).toBe(true);

      // アクション名が表示されていることを確認
      const actionName = await newPage.evaluate(() => {
        const divs = Array.from(document.querySelectorAll('div'));
        const actionNameDiv = divs.find((div) => {
          const style = window.getComputedStyle(div);
          return (
            style.position === 'fixed' &&
            style.zIndex === '2147483647' &&
            div.textContent?.trim() === 'タブ復元'
          );
        });
        return actionNameDiv?.textContent?.trim() ?? null;
      });
      expect(actionName).toBe('タブ復元');

      // 右クリックを離す
      await newPage.mouse.up({ button: 'right' });

      // 少し待機してからコンテキストメニューが抑制されたかを確認
      await new Promise((resolve) => setTimeout(resolve, 200));

      // コンテキストメニューが抑制されたことを確認
      await verifyContextMenuSuppressed(newPage);

      // 新しいページのサーバーを閉じる
      await closeTestServer(newPageServer);

      // タブが復元されるまで待機
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 新しいタブが開かれたことを確認
      const pagesAfter = context.pages();
      const tabCountAfter = pagesAfter.length;
      expect(tabCountAfter).toBe(pagesAfterNewPage.length + 1);

      // 復元されたタブを探す（新しいページ以外で、元のURLを持つタブ）
      const restoredPages = pagesAfter.filter((p) => {
        // 新しいページではない
        if (p === newPage) return false;
        // pagesAfterNewPageに含まれていない（新しく追加されたタブ）
        if (pagesAfterNewPage.includes(p)) return false;
        return true;
      });
      expect(restoredPages.length).toBe(1);

      const restoredPage = restoredPages[0];
      // 復元されたタブが存在することを明示的に確認
      expect(restoredPage).toBeDefined();
      expect(restoredPage).not.toBeNull();

      // TypeScriptの型チェッカーに、restoredPageが非nullであることを伝える
      // 上記のアサーションで保証されているため、非nullアサーション演算子を使用
      // 復元されたタブが完全に読み込まれるまで待機
      await restoredPage!.waitForLoadState('networkidle', { timeout: 10000 });

      // Content Scriptが読み込まれるまで待機
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 復元されたタブのURLが元のURLと一致することを確認
      const restoredUrl = restoredPage!.url();
      expect(restoredUrl).toBe(originalUrl);

      // 復元されたタブのタイトルが正しいことを確認
      const restoredTitle = await restoredPage!.title();
      expect(restoredTitle).toBe('Restore Tab Test');

      // 復元されたタブのコンテンツが正しいことを確認
      const restoredMarker = await restoredPage!.locator('#page-marker').textContent();
      expect(restoredMarker).toBe('このページはタブ復元テストページです。');
    } finally {
      // サーバーを閉じる
      await closeTestServer(server);
    }
  });
});

