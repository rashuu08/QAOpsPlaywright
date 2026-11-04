const { test } = require('@playwright/test');
const { loginToDataVault, LoginPageDV } = require('../pageobjects/LoginPageDV');

test('Login to Data Vault application', async ({ page }) => {
    // Call the reusable login function directly
    await loginToDataVault(page);

    // Alternatively, you can use the Page Object Model class:
    // const loginPage = new LoginPageDV(page);
    // await loginPage.login();

    await page.pause();
});

// Also exporting the function in case other files import from here
module.exports = { loginToDataVault };
