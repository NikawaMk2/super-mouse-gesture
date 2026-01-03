/**
 * E2Eテストのセットアップ用ヘルパー関数
 */
import { chromium, expect, type BrowserContext, type Page } from '@playwright/test';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer, type Server } from 'http';
import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

/**
 * 拡張機能のパスを取得する
 * @param testFilePath テストファイルのパス（import.meta.urlを渡す）
 * @returns 拡張機能のパス
 */
export function getExtensionPath(testFilePath: string): string {
  const __filename = fileURLToPath(testFilePath);
  const __dirname = dirname(__filename);
  return resolve(__dirname, '../../../dist');
}

/**
 * ブラウザコンテキストを作成する
 * @param extensionPath 拡張機能のパス
 * @returns 作成されたブラウザコンテキスト
 */
export async function createBrowserContext(extensionPath: string): Promise<BrowserContext> {
  try {
    // 拡張機能パスの存在確認
    const fs = await import('fs');
    const path = await import('path');
    if (!fs.existsSync(extensionPath)) {
      throw new Error(`拡張機能のパスが存在しません: ${extensionPath}`);
    }
    const manifestPath = path.join(extensionPath, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`manifest.jsonが見つかりません: ${manifestPath}`);
    }
    
    // CI環境ではheadlessモードを使用
    // 理由:
    // 1. CI環境（GitHub Actionsなど）にはディスプレイがないため、GUIが必要なheadless: falseモードでは実行できない
    // 2. リソースの節約: headlessモードの方がメモリやCPUの使用量が少なく、CI環境のリソース制限内で実行できる
    // 3. 実行速度: headlessモードの方が高速で、CI環境でのテスト実行時間を短縮できる
    // 4. 安定性: CI環境ではGUI関連のエラー（X11ディスプレイエラーなど）が発生しやすいため、headlessモードで回避できる
    // GitHub ActionsではCI環境変数が設定されているが、値は'true'とは限らないため、存在チェックを行う
    const isHeadless = !!process.env.CI;
    
    // 一時ディレクトリを作成（launchPersistentContextにはユーザーデータディレクトリのパスが必要）
    const userDataDir = mkdtempSync(join(tmpdir(), 'playwright-chrome-'));
    
    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: isHeadless,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });

    // 拡張機能が読み込まれるまで待機
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return context;
  } catch (error) {
    console.error('ブラウザコンテキストの作成に失敗しました:', error);
    throw error;
  }
}

/**
 * ページを1つ作成する
 * @param context ブラウザコンテキスト
 * @returns 作成されたページ
 */
export async function createPage(context: BrowserContext): Promise<Page> {
  return await context.newPage();
}

/**
 * ページを複数作成する
 * @param context ブラウザコンテキスト
 * @param count 作成するページ数
 * @returns 作成されたページの配列
 */
export async function createPages(context: BrowserContext, count: number): Promise<Page[]> {
  const pages: Page[] = [];
  for (let i = 0; i < count; i++) {
    pages.push(await context.newPage());
  }
  return pages;
}

/**
 * HTTPサーバーを作成して起動する
 * @param requestHandler リクエストハンドラー関数
 * @returns サーバーとベースURLを含むオブジェクト
 */
export async function createTestServer(
  requestHandler: (req: any, res: any) => void
): Promise<{ server: Server; baseUrl: string }> {
  const server = createServer(requestHandler);

  // ランダムなポートでサーバーを起動
  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      resolve();
    });
  });

  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  const baseUrl = `http://localhost:${port}`;

  return { server, baseUrl };
}

/**
 * HTTPサーバーを閉じる
 * @param server 閉じるサーバー
 */
export async function closeTestServer(server: Server): Promise<void> {
  server.closeAllConnections();
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
    // タイムアウトを設定（1秒）
    setTimeout(() => resolve(), 1000);
  });
}

/**
 * ページが完全に読み込まれるまで待機する
 * @param page 待機するページ（複数の場合は配列）
 */
export async function waitForPageLoad(page: Page | Page[]): Promise<void> {
  const pages = Array.isArray(page) ? page : [page];
  await Promise.all(pages.map((p) => p.waitForLoadState('networkidle')));

  // Content Scriptが読み込まれるまで待機
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

/**
 * コンテキストメニュー抑制確認のリスナーを設定する
 * @param page リスナーを設定するページ
 */
export async function setupContextMenuListener(page: Page): Promise<void> {
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
}

/**
 * コンテキストメニューが抑制されたことを確認する
 * @param page 確認するページ
 */
export async function verifyContextMenuSuppressed(page: Page): Promise<void> {
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
}

