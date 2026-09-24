// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { workers } from 'node:cluster';
import { trace } from 'node:console';


/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config=({
  testDir: './tests',
  testMatch:'**/*.spec.js',
retries:1,  //whenever  test fails it will re run for 1 time 
  workers : 3,  //it will run 3 test files in  parallel


  //Maximum time one test can run for - test  level timeout
  timeout: 30 *1000,
  expect :{
    timeout:100000
  },

  reporter : 'html',
  projects :[
  {
    name :'safari',
    use :
    {
       browserName: 'webkit',
       headless :false,
       screenshot:'off' ,
       trace: 'on',
       ...devices['iPhone  Pro Max'],
    }
  },
  {
    name :'chrome',
    use:
    {
      browserName :'chromium',
      headless :false,
      screenshot:'on',
      video:'retain-on-failure',
      ignoreHttpsErrors :true,
      permissions :['geolocation'],
      trace:'on',
     // viewport :{width:720 , height :720}
    }
  }
]
});

module.exports=config