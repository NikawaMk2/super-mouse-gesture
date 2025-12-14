# 07. Manifest定義書

## 1. 基本情報

| プロパティ | 値 | 備考 |
| :--- | :--- | :--- |
| `manifest_version` | `3` | |
| `name` | `"Super Mouse Gesture"` | |
| `version` | `"1.0.0"` | |
| `description` | `"Mouse gestures and super drag for better browsing experience."` | |
| `permissions` | `["tabs", "activeTab", "storage", "sessions"]` | `sessions`はタブ復元に必要 |
| `host_permissions` | `["<all_urls>"]` | すべてのページでジェスチャを有効にするため |

## 2. Background Service Worker

```json
"background": {
  "service_worker": "background.js",
  "type": "module"
}
```

## 3. Content Scripts

```json
"content_scripts": [
  {
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "run_at": "document_start"
  }
]
```
※ `run_at`: `document_start` にすることで、ページ読み込み直後からジェスチャ検知の準備を行う。ただしDOM依存の処理は `DOMContentLoaded` などを待つ必要がある。

## 4. Icons
サイズ別アイコン (16, 48, 128) を指定する。
