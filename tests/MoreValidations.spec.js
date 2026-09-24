const{test , expect} = require('@playwright/test')
const path = require('node:path');

//to run tests parallely from the same file 
//test.describe.configure({mode:'parallel'});


//to run tests serial mode  from the same file 
//it will make sure all previuos tests are passed - if 1st test fails it will skip the 2nd and 3rd test
test.describe.configure({mode:'serial'});


test("Popup validations",async({page})=>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    // await page.goto("http://google.com");
    // await page.goBack();
    // await page.goForward();
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
   // await page.pause();
    page.on('dialog',dialog => dialog.accept());
    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover();
    const framesPage = page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
     const textCheck =await framesPage.locator(".text h2").textContent();
    console.log(textCheck.split(" ")[1]);


})

test("screenshot & Visual Comparison", async({page}) =>
{
    //to check whether the button is hidden or not
     await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
     await expect(page.locator("#displayed-text")).toBeVisible();
     await page.locator("#displayed-text").screenshot({path:'partialScreenshot.png'});  //element level screenshot
     await page.locator("#hide-textbox").click();
     await page.screenshot({path:'screenshot.png'});  //page level screenshot
     await expect(page.locator("#displayed-text")).toBeHidden();
});


//file to file comparison (image to image)

test('visual testing', async({page})=>
{
    await page.goto("https://www.google.com/");
    expect(await page.screenshot()).toMatchSnapshot('landing.png');
});