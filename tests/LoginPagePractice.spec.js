const {test , expect} = require ('@playwright/test')

test('Login Page Form', async({page})=>{

   // const context= await browser.newContext();
   // const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client/");
    await page.locator('#userEmail').fill("rashmi.gupta.iic.0116@gmail.com");
    await page.locator('#userPassword').fill("Reyna08@");
    await page.locator("[value='Login']").click();
  //await page.locator(".card-body b").waitFor(); //when locator returns only single element
   //await page.waitForLoadState('networkidle');  //it will wait untill the page is  loaded
   
    await page.locator(".card-body b").first().waitFor();    // will give first element
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);

    
});