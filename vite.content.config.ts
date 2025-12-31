/**
 * Content Script Build Configuration
 *
 * content_scriptsはESMのimportをネイティブにサポートしないコンテキストで実行されることがあり、vite.config.tsのみの設定だと実行時にエラーが発生する。
 * 
 * そのため、vite.config.tsと本ファイルでビルド設定を分離する。
 * 1. ビルド設定の分離: contentスクリプトを独立してビルドし、他のエントリポイントとの共有チャンク生成を防ぐ。
 * 2. IIFE形式の出力: `format: 'iife'` を指定し、すべての依存コードを単一のファイルに即時関数としてバンドルする。
 *    これにより、import文を含まないスタンドアロンなスクリプトとして出力される。
 */
import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => ({
    define: {
        __DEV__: mode === 'development',
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: false, // Don't clear dist, as background build runs first
        rollupOptions: {
            input: {
                content: resolve(__dirname, 'src/content/index.ts'),
            },
            output: {
                entryFileNames: '[name].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
                format: 'iife',
            },
        },
        sourcemap: true,
        minify: mode === 'production',
    },
}));
