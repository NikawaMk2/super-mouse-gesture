# TypeScript コーディング規約

## 1. 型定義
- enumの代わりに、オブジェクトリテラル＋型エイリアスを使用すること。
  - 良い例：
    ```ts
    export const UserRole = {
      ADMIN: 'admin',
      USER: 'user',
      GUEST: 'guest',
    } as const;
    export type UserRole = typeof UserRole[keyof typeof UserRole];
    ```
  - 悪い例：
    ```ts
    enum UserRole {
      ADMIN = 'admin',
      USER = 'user',
      GUEST = 'guest',
    }
    ```

## 2. DIコンテナの利用
- 型エイリアスの値に応じて、対応するクラスやサービスのインスタンスをDIコンテナから取得して返す実装とすること。
  - 例：
    ```ts
    // 型エイリアス
    export const ServiceType = {
      USER: 'user',
      PRODUCT: 'product',
    } as const;
    export type ServiceType = typeof ServiceType[keyof typeof ServiceType];

    // DIコンテナから取得
    function getService(type: ServiceType) {
      switch (type) {
        case ServiceType.USER:
          return diContainer.get(UserService);
        case ServiceType.PRODUCT:
          return diContainer.get(ProductService);
        default:
          throw new Error('Unknown service type');
      }
    }
    ```

## 3. 命名規則
- ファイル名はスネークケースとする。
- ディレクトリ・ファイル構成はプロジェクトのルートにある規約に従うこと。

## 4. 制御構文の書き方
- if文やfor文などの制御構文は、実行文が1行でも必ず中括弧（{}）で囲むこと。
  - 良い例：
    ```ts
    if (isValid) {
      doSomething();
    }
    ```
  - 悪い例：
    ```ts
    if (isValid)
      doSomething();
    ```

## 5. リソース管理
- リソース（イベントリスナー、タイマー、アニメーションフレームなど）は必ず適切にクリーンアップすること。
- クラスがリソースを保持する場合は、`destroy`メソッドを実装し、そこでクリーンアップを行うこと。
  - 良い例：
    ```ts
    class EventHandler {
      private listeners: Set<() => void> = new Set();

      constructor() {
        this.addEventListeners();
      }

      private addEventListeners(): void {
        document.addEventListener('click', this.handleClick);
        this.listeners.add(() => {
          document.removeEventListener('click', this.handleClick);
        });
      }

      public destroy(): void {
        for (const cleanup of this.listeners) {
          cleanup();
        }
        this.listeners.clear();
      }

      private handleClick = (e: MouseEvent): void => {
        // イベント処理
      };
    }
    ```
  - 悪い例：
    ```ts
    class EventHandler {
      constructor() {
        document.addEventListener('click', this.handleClick);
      }

      private handleClick(e: MouseEvent): void {
        // イベント処理
      }
    }
    ```

## 6. 分岐処理の一般ルール
- メソッド・関数・イベントリスナー・コールバック等で、外部から受け取るデータ（引数・メッセージ・リクエスト等）に対して分岐処理を行う場合は、以下の点に注意すること。
  - 受信データがnull/undefinedまたは想定外の型・値の場合は、即座に処理を中断し、必要に応じてエラーやfalse等を返す。
  - 識別子（例: action/type/command等）や条件ごとにif/else ifやswitchで明確に分岐し、どの分岐にも該当しない場合は明示的に処理を終了する（returnやbreak等）。
  - これにより、不正なデータや未対応リクエスト受信時の安全性が向上し、予期せぬバグや例外発生を防止できる。
  - 例：
    ```ts
    function handleRequest(request: any): boolean {
      if (!request || typeof request !== 'object') {
        return false;
      }
      if (request.type === 'A') {
        // ...
        return true;
      } else if (request.type === 'B') {
        // ...
        return true;
      }
      // 未対応type
      return false;
    }
    ```
    
    ```ts
    // イベントリスナーやコールバックでも同様
    someListener((message, sender, sendResponse) => {
      if (!message || typeof message !== 'object') {
        return false;
      }
      if (message.type === 'A') {
        // ...
        sendResponse({ result: 'ok' });
        return true;
      } else if (message.type === 'B') {
        // ...
        sendResponse({ result: 'ok' });
        return true;
      }
      return false;
    });
    ```
