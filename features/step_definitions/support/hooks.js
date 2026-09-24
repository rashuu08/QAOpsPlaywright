const playwright = require('@playwright/test');
const { POManager } = require('../../../pageobjects/POManager');
const { Before, After, BeforeStep, AfterStep ,Status} = require('@cucumber/cucumber');


//browser related changes added in before hooks
// Before({tags: "@foo and @bar"}, function () {
//   // This hook will be executed before scenarios tagged with @foo and @bar
// })
Before(async function () {

    const browser = await playwright.chromium.launch(
        {
            headless: false
        }
    );

    const context = await browser.newContext();
    this.page = await context.newPage();
    this.poManager = new POManager(this.page);
});
BeforeStep(function () {

})
AfterStep(async function ({ result }) {

    if (result.status === Status.FAILED) {
        await this.page.screenshot({path:'bugscreenshot1.png'});
    }
});

After(function () {
    console.log("Last statement");
});



