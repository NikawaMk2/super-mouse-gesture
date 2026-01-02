# E2Eテスト規約

## 1. はじめに
本ドキュメントは、Chrome拡張機能「Super Mouse Gesture」におけるE2Eテストの規約を定める。
テストの品質、信頼性、保守性を向上させ、プロジェクト全体で一貫性のあるテストコードを維持することを目的とする。

## 2. アサーションの原則

### 2.1. 条件分岐内でのアサーション禁止
**条件分岐内でアサーションを行うと、変数が`null`や`undefined`の場合でもテストが成功してしまう問題が発生する。必ず条件分岐の外でアサーションを行うこと。**

#### ❌ 悪い例: 条件分岐内でアサーション
```typescript
const newPage = newPages[0];
if (newPage) {
  // この条件分岐内でアサーションを行うと、
  // newPageがnull/undefinedの場合でもテストが成功してしまう
  expect(newPage.url()).toContain('/page2');
  expect(await newPage.title()).toBe('Page 2');
}
```

#### ✅ 良い例: 条件分岐の外でアサーション
```typescript
const newPage = newPages[0];
// 変数が存在することを明示的にアサート
expect(newPage).toBeDefined();
expect(newPage).not.toBeNull();

// 型アサーション: 上記のアサーションにより、newPageは確実に存在する
const openedPage = newPage as Page;

// その後、アサーションを実行
expect(openedPage.url()).toContain('/page2');
expect(await openedPage.title()).toBe('Page 2');
```

### 2.2. 存在チェックのアサーション
**オプショナルな値や配列の要素を使用する前に、必ず存在チェックのアサーションを行うこと。**

#### 必須のアサーション
- `expect(variable).toBeDefined()`: 変数が`undefined`でないことを確認
- `expect(variable).not.toBeNull()`: 変数が`null`でないことを確認

#### 使用例
```typescript
// 配列から要素を取得
const newPages = pagesAfter.filter((p) => !pagesBefore.includes(p));
expect(newPages.length).toBe(1);

const newPage = newPages[0];
// 存在チェックのアサーション（必須）
expect(newPage).toBeDefined();
expect(newPage).not.toBeNull();

// 型アサーションを使用する場合も、その前に必ず存在チェックを行う
const openedPage = newPage as Page;
```

### 2.3. 型アサーションの使用
**型アサーションを使用する場合は、その前に必ず存在チェックのアサーションを行うこと。型アサーションは型チェックを回避するため、実行時エラーの原因となる可能性がある。**

#### ❌ 悪い例: 存在チェックなしで型アサーション
```typescript
const newPage = newPages[0];
// 存在チェックなしで型アサーションを使用
const openedPage = newPage as Page; // newPageがundefinedの場合、実行時エラー
```

#### ✅ 良い例: 存在チェック後に型アサーション
```typescript
const newPage = newPages[0];
// 存在チェックのアサーション（必須）
expect(newPage).toBeDefined();
expect(newPage).not.toBeNull();

// 存在チェック後に型アサーションを使用
const openedPage = newPage as Page;
```

## 3. テストの構造

### 3.1. テストのセットアップとクリーンアップ
- `test.beforeAll`でブラウザコンテキストとページを作成
- `test.afterAll`でリソースをクリーンアップ
- 各テスト内でHTTPサーバーを使用する場合は、`try-finally`で確実にクリーンアップ

### 3.2. 待機処理
- ページの読み込み完了を待つ: `waitForPageLoad(page)`
- 非同期処理の完了を待つ: 適切な`waitFor`や`Promise`を使用
- 固定の待機時間は最小限に: 可能な限り条件ベースの待機を使用

### 3.3. アサーションの順序
1. **前提条件の確認**: テストの前提となる状態を確認
2. **操作の実行**: テスト対象の操作を実行
3. **結果の確認**: 期待される結果を確認

## 4. 変数名の衝突回避

### 4.1. スコープ内の変数名
**テストスコープ内で既に使用されている変数名（例: `page`）と衝突しないよう、適切な変数名を使用すること。**

#### ❌ 悪い例: 変数名の衝突
```typescript
let page: Page; // テストスコープで定義済み

// 型アサーションで同じ変数名を使用
const page = newPage as Page; // エラー: 変数名の衝突
```

#### ✅ 良い例: 適切な変数名を使用
```typescript
let page: Page; // テストスコープで定義済み

// 型アサーションで異なる変数名を使用
const openedPage = newPage as Page; // OK: 変数名の衝突なし
```

## 5. エラーハンドリング

### 5.1. エラーメッセージ
**アサーションが失敗した場合に、何が問題だったのかを明確に示すエラーメッセージを提供すること。**

```typescript
// エラーメッセージを追加
expect(newPage).toBeDefined();
expect(newPage).not.toBeNull();
// または、カスタムメッセージを使用
expect(newPages.length).toBe(1, '新しいタブが1つ開かれるべき');
```
