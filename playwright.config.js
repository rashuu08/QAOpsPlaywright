// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { trace } from 'node:console';


/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config=({
  testDir: './tests',
  testMatch:'**/*.spec.js',
  retries:0,
  
  //Maximum time one test can run for - test  level timeout
  timeout: 30 *1000,
  expect :{
    timeout:100000
  },

  reporter : 'html',
  use: {
    //action timeout set globally
    actionTimeout:10* 5000,
    navigationTimeout : 30* 1000,
    browserName:'chromium',
    headless : false,
    screenshot:'on', //to take screenshot for every step
    //trace:'on'  //trace all the step
    trace:'retain-on-failure'  //it will only provoide failed test cases
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    
  },
});

module.exports=config