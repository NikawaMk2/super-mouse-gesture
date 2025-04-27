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
