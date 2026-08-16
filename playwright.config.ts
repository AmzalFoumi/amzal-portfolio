import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const baseURL = `http://127.0.0.1:${PORT}`;

/**
 * Three tripwires, not a test suite.
 *
 * These cover only what Vitest structurally cannot: print pagination, and route
 * behaviour against a real build. Everything else about the CV pipeline is unit
 * tested in `src/lib/**`, which is far faster — resist growing this file.
 *
 * Runs against a production build rather than `next dev`, because two of the
 * three assertions are about build and route output.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL, trace: "on-first-retry" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
