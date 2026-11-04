// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'Creds.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  retries: 0,

  // Maximum time one test can run for - extended to 5 minutes for multi-filter validations
  timeout: 300 * 1000,
  expect: {
    timeout: 15 * 1000
  },

  reporter: 'html',
  use: {
    // Action and navigation timeouts
    actionTimeout: 15 * 1000,
    navigationTimeout: 60 * 1000,
    browserName: 'chromium',
    headless: false,
    launchOptions: { args: ['--start-maximized'] },
    viewport: null,
    screenshot: 'on',
    trace: 'retain-on-failure'
  },
});

module.exports = config;
