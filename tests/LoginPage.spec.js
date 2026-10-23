const {test , expect} = require ('@playwright/test')


test('Validate Smart Insights Data By using project , year , month and week filters  ',async ({page})=>
{
    await page.goto("https://admin-live.data-vault.vretail.space/login");
    await page.locator('#email-input').fill("test.admin@iic.com");
    await page.locator('#password-input').fill("Inkincaps@123");
    await page.locator('text=Login').click();
    
    
    await page.waitForLoadState('domcontentloaded');
    await page.locator('body').click();
    await page.getByRole('button', { name: 'Close walkthrough' }).click();

   await  page.pause();

});