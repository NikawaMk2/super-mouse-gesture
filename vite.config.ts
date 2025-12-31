/// <reference types="vitest" />
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
        emptyOutDir: true,
        rollupOptions: {
            input: {
                background: resolve(__dirname, 'src/background/index.ts'),
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
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        define: {
            __DEV__: true,
        },
    },
}));
