import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright設定
 * 
 * 注意: Chrome拡張機能を読み込むテストは、テストファイル内で
 * chromium.launchPersistentContext()を使用して拡張機能を読み込む。
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});

