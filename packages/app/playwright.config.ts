import { defineConfig, devices } from '@playwright/test';

// Not the default port of Astro, so that a preview that a person started stays free.
const port = 4329;
const baseURL = `http://localhost:${port}`;

// The tests run against the built site. The `test` script builds it first.
// Web server setup: https://playwright.dev/docs/test-webserver
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: 'list',
  timeout: 30_000,
  globalTimeout: 10 * 60_000,
  use: { baseURL },
  projects: [
    { name: 'phone', use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 812 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
  ],
  webServer: {
    // `--ignore-lock` keeps the server in the foreground for the test run. Without it,
    // Astro moves the server to the background when an agent starts it, and the command ends.
    command: `pnpm exec astro preview --port ${port} --ignore-lock`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
