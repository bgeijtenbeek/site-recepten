import { defineConfig, devices } from '@playwright/test';

const basePath = '/site-recepten/';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  use: {
    baseURL: `http://127.0.0.1:4321${basePath}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'pnpm build && node tests/e2e/serve-preview.mjs',
    env: {
      SITE_URL: 'http://127.0.0.1:4321',
      SITE_BASE: basePath,
    },
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
});
