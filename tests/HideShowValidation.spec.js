const{test , expect} = require('@playwright/test')

test("Check Hide show Test" , async({page})=>
{
   await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
   // await page.goto("https:google.com")
  // await page.goBack(); //go back to the previous url/page
   // await page.goForward(); //go forward to the next url/page
  await expect(page.locator("#displayed-text")).toBeVisible();
  await page.locator("#hide-textbox").click();
  await expect(page.locator("#displayed-text")).toBeHidden();

  // await page.goto("https://www.instagram.com/");
  // await page.locator("[type='password']").fill("Reyna08@");
  // await page.locator("[aria-label$='Show password']").click();
  // await page.locator

  //alert popups
   
   await page.locator("#confirmbtn").click();
   await page.on('dialog' , dialog=>dialog.accept()); //to accept the popup
   // page.on('dialog' , dialog=>dialog.dismiss()); //to reject the popup
   
   await page.pause();
   
});