# テストケース
* テストケースは日本語で記載する。

# テスト容易性・モック方針
- chrome APIや外部依存はjest等でグローバルモックを用意し、Node.js環境でもテスト可能にすること。
- 依存性注入により、テスト時はモックを注入できる設計とすること。
- windowやlocation等のグローバルオブジェクトの状態はテスト間で副作用が出ないよう、beforeEach等で初期化すること。

# テストコード作成・修正ルール
- 新規クラス追加時は必ずテストコードも作成し、正常系・異常系・境界値・例外系を網羅すること。
- 既存クラス修正時は関連テストの修正要否を確認し、必要に応じてテストケースを追加・修正すること。
- テスト実行し、全てパスすることを確認する。

# chrome-extension-test: テストコード配置・命名ルール

## 1. ユニットテスト
- - DIコンテナ（inversifyのContainer等）を利用している場合、テスト時はjest.mockでContainer自体をモック化し、依存解決エラーを回避すること。これにより、コンストラクタ引数の@inject等が不足していてもテストが通るようにする。
- ファイル名は`<テスト対象のファイル名>.test.<テスト対象のクラスのファイルの拡張子>`とする。
- テストコードの作成先は`test/` 配下かつテスト対象のファイルが配置されている位置と同一となるようにする。

### 例
message_util.tsのテストコードを作成する場合
```bash
.
├── src/
│   └── common/
│       └── utils/
│         └── message_util.ts
└── test/
    └── common/
        └── utils/
          └── message_util.test.ts
```

---

## 2. 結合テスト（Integration Test）
- `/test/integration/`配下に配置する。
- テスト対象の本体コードのディレクトリ構成に合わせて、サブディレクトリを作成する。
  - 例：background/services/gesture_actionの結合テスト → `/test/integration/background/services/gesture_action/`
- ファイル名はスネークケース＋`<テスト対象の本体コードのファイル名>_integration.test.ts`とする。
- テスト内容・対象が分かるように命名する。

### 例
background/services/gesture_action/gesture_action_factory.tsの結合テストを作成する場合
```bash
.
├── src/
│   └── background/
│       └── services/
│           └── gesture_action/
│               └── gesture_action_factory.ts
└── test/
    └── integration/
        └── background/
            └── services/
                └── gesture_action/
                    └── gesture_action_factory_integration.test.ts
```

---

## 3. 命名規則
- ディレクトリ・ファイル名はすべてスネークケースで統一する。
- テストの粒度（unit/integration）が一目で分かるよう、ファイル名に明示する。

---

## 4. 備考
- 結合テストは、DIコンテナや複数クラスの連携を検証するものを対象とする。
- ユニットテストと結合テストは明確にディレクトリで分離する。
