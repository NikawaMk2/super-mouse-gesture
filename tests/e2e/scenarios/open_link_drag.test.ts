import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import {
  getExtensionPath,
  createBrowserContext,
  createPage,
  createTestServer,
  closeTestServer,
  waitForPageLoad,
} from '../helpers/test-setup';

/**
 * リンクを新しいタブで開くスーパードラッグのE2Eテスト
 */
test.describe('リンクを新しいタブで開くスーパードラッグ', () => {
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

  test('リンクをドラッグ＆ドロップすると、新しいタブでリンクが開かれること', async () => {
    // 最初のページのHTMLコンテンツ（リンクを含む）
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
          a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #0066cc;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
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

      // ページ1にいることを確認
      const page1Title = await page.title();
      expect(page1Title).toBe('Page 1');

      // 初期タブ数を取得
      const initialPages = context.pages();
      const initialPageCount = initialPages.length;

      // リンク要素を取得
      const linkElement = page.locator('#link-to-page2');
      await expect(linkElement).toBeVisible();

      // リンクの位置を取得
      const linkBox = await linkElement.boundingBox();
      if (!linkBox) {
        throw new Error('リンク要素の位置を取得できませんでした');
      }

      // ドラッグ開始位置（リンクの中央）
      const startX = linkBox.x + linkBox.width / 2;
      const startY = linkBox.y + linkBox.height / 2;

      // ドロップ位置（リンクから離れた位置、MIN_DRAG_DISTANCE以上）
      const dropX = startX + 100; // 右方向に100px移動
      const dropY = startY + 50; // 下方向に50px移動

      // dragstartイベントを手動で発火
      await page.evaluate(({ startX, startY }) => {
        const element = document.getElementById('link-to-page2');
        if (!element) return;

        const anchorElement = element as HTMLAnchorElement;
        const dragStartEvent = new DragEvent('dragstart', {
          bubbles: true,
          cancelable: true,
          clientX: startX,
          clientY: startY,
        });

        // DataTransferを設定
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('text/plain', anchorElement.href);
        Object.defineProperty(dragStartEvent, 'dataTransfer', {
          value: dataTransfer,
          writable: false,
        });

        element.dispatchEvent(dragStartEvent);
      }, { startX, startY });

      // 少し待機してからdragoverイベントを発火
      await new Promise((resolve) => setTimeout(resolve, 100));

      // dragoverイベントを発火
      await page.evaluate(({ dropX, dropY }) => {
        const dragOverEvent = new DragEvent('dragover', {
          bubbles: true,
          cancelable: true,
          clientX: dropX,
          clientY: dropY,
        });
        document.body.dispatchEvent(dragOverEvent);
      }, { dropX, dropY });

      // ドラッグ操作中にアクション名が表示されることを確認
      // アクション名は画面中央に表示される固定位置の要素
      const actionNameElement = page.locator('text=リンクを開く');
      await expect(actionNameElement).toBeVisible({ timeout: 1000 });

      // アクション名のスタイルを確認（画面中央に表示される固定位置要素）
      const actionNameStyle = await actionNameElement.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          position: style.position,
          display: style.display,
          zIndex: style.zIndex,
        };
      });
      expect(actionNameStyle.position).toBe('fixed');
      expect(actionNameStyle.display).toBe('block');
      expect(actionNameStyle.zIndex).toBe('2147483647');

      // 少し待機してからdropイベントを発火
      await new Promise((resolve) => setTimeout(resolve, 100));

      // dropイベントを発火
      await page.evaluate(({ dropX, dropY }) => {
        const dropEvent = new DragEvent('drop', {
          bubbles: true,
          cancelable: true,
          clientX: dropX,
          clientY: dropY,
        });

        // DataTransferを設定（実装ではdragStateのデータを使用するため、ここでは空でも良い）
        const dataTransfer = new DataTransfer();
        Object.defineProperty(dropEvent, 'dataTransfer', {
          value: dataTransfer,
          writable: false,
        });

        document.body.dispatchEvent(dropEvent);
      }, { dropX, dropY });

      // 新しいタブが開かれるまで待機
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 新しいタブが開かれたことを確認
      const pagesAfter = [...context.pages()];
      const tabCountAfter = pagesAfter.length;
      expect(tabCountAfter).toBeGreaterThan(initialPageCount);

      // 新しく開かれたタブを探す
      const pagesBefore = initialPages;
      const newPages = pagesAfter.filter((p) => !pagesBefore.includes(p));
      expect(newPages.length).toBe(1);

      const newPage = newPages[0];
      // 新しいタブが存在することを確認
      expect(newPage).toBeDefined();
      expect(newPage).not.toBeNull();

      // 型アサーション: 上記のアサーションにより、newPageは確実に存在する
      const openedPage = newPage as Page;

      // 新しいタブが完全に読み込まれるまで待機
      await waitForPageLoad(openedPage);

      // ページ2のURLであることを確認
      const newPageUrl = openedPage.url();
      expect(newPageUrl).toContain('/page2');

      // ページ2にいることを確認
      const page2Title = await openedPage.title();
      expect(page2Title).toBe('Page 2');

      // ページ2のコンテンツが表示されていることを確認
      const page2Marker = await openedPage.locator('#page2-marker').textContent();
      expect(page2Marker).toBe('このページはページ2です。');

      // 元のページ（ページ1）は変更されていないことを確認
      const originalPageTitle = await page.title();
      expect(originalPageTitle).toBe('Page 1');
    } finally {
      // サーバーを閉じる
      await closeTestServer(server);
    }
  });
});
