# ディレクトリ構成設計

本プロジェクト「Super Mouse Gesture」のディレクトリ構成を以下の通り定義する。

## 1. ディレクトリ構成詳細

プロジェクトルートからの完全な構成図を以下に示す。

```text
/ (Project Root)
├── dist/                   # ビルド出力ディレクトリ
├── documents/              # 設計ドキュメント
├── public/                 # 静的アセット (ビルド時に`dist/`にコピーされる)
│   ├── icons/              # アプリアイコン
│   └── manifest.json       # Chrome Extension Manifest V3
│
├── src/                    # ソースコード
│   ├── background/         # Service Worker (Background Process)
│   │   ├── handlers.ts     # メッセージハンドラー
│   │   └── index.ts        # エントリーポイント
│   │
│   ├── content/            # Content Scripts (Webページ上で動作)
│   │   ├── actions/        # アクション実行ロジック
│   │   ├── drag/           # スーパードラッグ機能
│   │   ├── gestures/       # マウスジェスチャ機能
│   │   │   ├── core.ts     # 認識ロジック
│   │   │   ├── definitions.ts
│   │   │   └── visual.ts   # 描画ロジック
│   │   ├── index.ts        # エントリーポイント
│   │   └── styles.css      # CS用スタイル
│   │
│   └── shared/             # フロント/バックエンド共通モジュール
│       ├── types/          # 型定義
│       │   ├── gesture-action.ts    # ジェスチャアクションの種類定義
│       │   └── gesture-direction.ts # ジェスチャの方向定義
│       ├── utils/          # ユーティリティ
│       ├── constants.ts
│       └── logger.ts       # ロガー
│
├── tests/                  # テストコード
│   ├── unit/               # 単体テスト (Vitest)
│   │   ├── background/     # Background系のロジックテスト
│   │   ├── content/        # ジェスチャ認識ロジック等のテスト
│   │   └── shared/         # 共通関数のテスト
│   │
│   ├── integration/        # インテグレーションテスト (Vitest)
│   │   ├── background/     # Background系のロジックテスト
│   │   └── content/        # ジェスチャ認識ロジック等のテスト
│   │
│   └── e2e/                # E2Eテスト (Playwright)
│       └── scenarios/      # 実際のブラウザ動作を伴うシナリオテスト
│
├── package.json            # npmパッケージ定義
├── tsconfig.json           # TypeScript設定
├── vite.config.ts          # Viteビルド設定
└── directory-structure.md  # 本ファイル
```

## 2. テストコードのディレクトリ構成

`unit`配下のディレクトリ構成は`src`配下のディレクトリ構成と同一とする。
