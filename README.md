# Super Mouse Gesture

Manifest V3、TypeScript、Vite で構築された、マウスジェスチャーとスーパードラッグのための Chrome 拡張機能です。

## 概要

Super Mouse Gesture は、カスタマイズ可能なマウスジェスチャーとスーパードラッグ機能を提供し、ブラウジング体験を向上させます。

## 機能

- **マウスジェスチャー**: マウスで特定の形状を描くことで、ブラウザのアクションを実行します。
- **スーパードラッグ**: テキストやリンクをドラッグすることで、素早くアクションを実行します。
- **Manifest V3**: 最新の Chrome 拡張機能標準に準拠しています。

## 使い方

### マウスジェスチャー

右クリックを押しながらマウスを動かし、ジェスチャーを描いてからクリックを離すとアクションが実行されます。
利用可能なデフォルトのジェスチャーは以下の通りです：

| ジェスチャー | アクション |
|---|---|
| **↑** | 上へスクロール |
| **↓** | 下へスクロール |
| **←** | 戻る |
| **→** | 進む |
| **↑ ←** | 前のタブへ |
| **↑ →** | 次のタブへ |
| **↓ ←** | タブを閉じて左へ移動 |
| **↓ →** | タブを閉じて右へ移動 |
| **← ↑** | ページ拡大 |
| **← ↓** | ページ縮小 |
| **→ ↑** | 新しいタブを開く |
| **→ ↓** | フルスクリーン切り替え |
| **↓ ↑** | ページトップへ |
| **↑ ↓** | ページ最下部へ |
| **← →** | 再読み込み |
| **→ ←** | 閉じたタブを開く |

### スーパードラッグ

Webページ上のリンクやテキストをドラッグ＆ドロップすることでアクションを実行します。

| 対象 | アクション |
|---|---|
| **リンク** | 新しいタブで開く |
| **テキスト** | 選択したテキストで検索 (Google) |

## プロジェクト構成

```text
/
├── dist/                   # ビルド出力
├── documents/              # ドキュメント
├── public/                 # 静的アセット (manifest.json, icons)
├── src/                    # ソースコード
│   ├── background/         # Service Worker (バックグラウンドロジック)
│   ├── content/            # Content scripts (ジェスチャー, ドラッグ)
│   └── shared/             # 共通ユーティリティと型
├── tests/                  # テストファイル (Unit, Integration, E2E)
└── vite.config.ts          # Vite 設定
```

詳細なディレクトリ構成については、[directory-structure.md](./directory-structure.md) を参照してください。

## 開発

### 前提条件

- Node.js (最新の LTS 推奨)
- npm

### セットアップ

依存関係をインストールします：
```bash
npm install
```

### ビルド

拡張機能をビルドするには：

```bash
# 開発用ビルド
npm run dev

# 本番用ビルド
npm run build
```

ビルドされた成果物は `dist/` ディレクトリに出力されます。

### Chrome への読み込み

1. Chrome を開き、`chrome://extensions/` に移動します。
2. 右上の「デベロッパーモード」を有効にします。
3. 「パッケージ化されていない拡張機能を読み込む」をクリックします。
4. このプロジェクトの `dist/` ディレクトリを選択します。

## テスト

このプロジェクトでは、単体/統合テストに **Vitest**、E2Eテストに **Playwright** を使用しています。

```bash
# 全ての単体/統合テストを実行
npm test

# 単体テストのみ実行
npm run test:unit

# 統合テストのみ実行
npm run test:integration

# E2Eテストを実行
npm run test:e2e
```

## 技術スタック

- **Framework**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Testing**: [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/)
