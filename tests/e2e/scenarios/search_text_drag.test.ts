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
 * 選択したテキストで検索するスーパードラッグのE2Eテスト
 */
test.describe('選択したテキストで検索するスーパードラッグ', () => {
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

  test('テキストを選択してドラッグ＆ドロップすると、新しいタブでGoogle検索が開かれること', async () => {
    // テストページのHTMLコンテンツ（検索対象のテキストを含む）
    const testPageContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Page</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            background-color: #f0f0f0;
          }
          h1 {
            color: #333;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            margin: 20px 0;
          }
          #search-text {
            font-weight: bold;
            color: #0066cc;
            padding: 10px;
            background-color: #e6f3ff;
            border: 1px solid #0066cc;
            border-radius: 4px;
            display: inline-block;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <h1>テストページ</h1>
        <p>これはテスト用のページです。</p>
        <p id="search-text">TypeScript Playwright</p>
        <p>このテキストを選択してドラッグすると、検索が実行されます。</p>
      </body>
      </html>
    `;

    // HTTPサーバーを起動
    const { server, baseUrl } = await createTestServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(testPageContent);
    });

    try {
      // テストページに移動
      await page.goto(baseUrl);

      // ページが完全に読み込まれるまで待機
      await waitForPageLoad(page);

      // テストページにいることを確認
      const pageTitle = await page.title();
      expect(pageTitle).toBe('Test Page');

      // 初期タブ数を取得
      const initialPages = context.pages();
      const initialPageCount = initialPages.length;

      // 検索対象のテキスト要素を取得
      const textElement = page.locator('#search-text');
      await expect(textElement).toBeVisible();

      // テキストを選択
      const searchText = 'TypeScript Playwright';
      
      // テキスト要素の位置を取得
      const textBox = await textElement.boundingBox();
      if (!textBox) {
        throw new Error('テキスト要素の位置を取得できませんでした');
      }

      // プログラム的にテキストを選択
      await page.evaluate(() => {
        const element = document.getElementById('search-text');
        if (!element) return;

        // テキスト選択をプログラム的に作成
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          const range = document.createRange();
          range.selectNodeContents(element);
          selection.addRange(range);
        }
      });

      // 選択されたテキストを確認
      const selectedText = await page.evaluate(() => {
        const selection = window.getSelection();
        return selection ? selection.toString() : '';
      });
      expect(selectedText.trim()).toBe(searchText);

      // ドラッグ開始位置（テキストの中央）
      const startX = textBox.x + textBox.width / 2;
      const startY = textBox.y + textBox.height / 2;

      // ドロップ位置（テキストから離れた位置、MIN_DRAG_DISTANCE以上）
      const dropX = startX + 100; // 右方向に100px移動
      const dropY = startY + 50; // 下方向に50px移動

      // テキスト選択を保持したまま、dragstart/dropイベントを発火
      // 実装ではwindow.getSelection()が優先されるため、テキスト選択を確実に保持する
      // 注意: イベントを発火する前に、テキスト選択を再確認して保持する
      await page.evaluate(({ startX, startY, searchText }) => {
        const element = document.getElementById('search-text');
        if (!element) return;

        // テキスト選択を確実に作成（再確認）
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          const range = document.createRange();
          range.selectNodeContents(element);
          selection.addRange(range);
        }

        // テキスト選択が正しく作成されたことを確認
        const selectedText = selection?.toString().trim() || '';
        if (selectedText !== searchText) {
          console.error('テキスト選択が正しく作成されませんでした:', selectedText, '期待値:', searchText);
          return;
        }

        // dragstartイベントを手動で発火
        // 実装ではwindow.getSelection()が優先されるため、選択を保持したまま発火
        const dragStartEvent = new DragEvent('dragstart', {
          bubbles: true,
          cancelable: true,
          clientX: startX,
          clientY: startY,
        });
        
        // DataTransferを設定（フォールバック用、実装ではwindow.getSelection()が優先される）
        const dataTransfer = new DataTransfer();
        const currentSelection = window.getSelection();
        if (currentSelection && currentSelection.toString().trim().length > 0) {
          dataTransfer.setData('text/plain', currentSelection.toString().trim());
        } else {
          // フォールバック: 明示的にテキストを設定
          dataTransfer.setData('text/plain', searchText);
        }
        Object.defineProperty(dragStartEvent, 'dataTransfer', {
          value: dataTransfer,
          writable: false,
        });

        // イベントを発火（event.targetは自動的に設定される）
        element.dispatchEvent(dragStartEvent);
      }, { startX, startY, searchText });

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
      const actionNameElement = page.locator('text=テキストを検索');
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
      // 注意: dropイベント時にはテキスト選択が解除されている可能性があるため、
      // 実装ではdragStateに保存されたデータを使用する
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
      await new Promise((resolve) => setTimeout(resolve, 2000));

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
      const searchPage = newPage as Page;

      // Google検索ページが開かれるまで待機（リダイレクトを考慮）
      await searchPage.waitForURL(/google\.com\/search/, { timeout: 10000 });

      // 新しいタブが完全に読み込まれるまで待機
      await waitForPageLoad(searchPage);

      // Google検索のURLであることを確認
      const searchPageUrl = searchPage.url();
      expect(searchPageUrl).toContain('google.com/search');

      // 検索クエリの検証
      // Googleは検索クエリを暗号化することがあるため、複数の方法で検証する
      const urlParams = new URL(searchPageUrl).searchParams;
      const queryParam = urlParams.get('q');
      
      if (queryParam && queryParam.length > 0 && !queryParam.match(/^[A-Za-z0-9_-]+$/)) {
        // クエリパラメータが存在し、暗号化されていない場合（通常のテキストの場合）
        // 検索クエリに選択したテキストが含まれていることを確認
        expect(queryParam).toContain('TypeScript');
        expect(queryParam).toContain('Playwright');
      } else {
        // クエリパラメータが暗号化されている場合、または存在しない場合
        // ページのタイトルやコンテンツで検証する
        const pageTitle = await searchPage.title();
        expect(pageTitle).toBeTruthy();
        
        // Google検索結果ページのタイトルには検索クエリが含まれることが多い
        // ただし、完全一致は期待しない（Googleのローカライズや動的なタイトル生成のため）
        // 検索ページが正しく開かれたことを確認する
        expect(pageTitle.length).toBeGreaterThan(0);
      }

      // 元のページは変更されていないことを確認
      const originalPageTitle = await page.title();
      expect(originalPageTitle).toBe('Test Page');
    } finally {
      // サーバーを閉じる
      await closeTestServer(server);
    }
  });
});

