/**
 * Reusable Login Page Object & Helper Functions for Data Vault application
 */

class LoginPageDV {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.emailInput = page.locator('input[type="email"]');
        this.passwordInput = page.locator('input[type="password"]');
        this.loginButton = page.locator('button:has-text("Login")');
        this.enterVaultButton = page.getByRole('button', { name: /Enter Data Vault/i });
        this.closeWalkthroughButton = page.getByRole('button', { name: 'Close walkthrough' });
    }

    async goTo() {
        await this.page.goto('https://admin-live.data-vault.vretail.space/login');
    }

    async login(email = process.env.USER_EMAIL, password = process.env.USER_PASSWORD) {
        try {
            await this.goTo();
            await this.emailInput.fill(email);
            await this.passwordInput.fill(password);
            await this.loginButton.click();
            await this.page.waitForLoadState('networkidle');

            // Handle post-login buttons if they appear
            try {
                await this.enterVaultButton.click({ timeout: 5000 });
            } catch (_) {
                // Not displayed or already clicked
            }

            try {
                await this.closeWalkthroughButton.click({ timeout: 5000 });
            } catch (_) {
                // Walkthrough modal not displayed or already closed
            }

            console.log('Login attempt completed successfully.');
        } catch (error) {
            console.error('An error occurred during login:', error);
            throw error;
        }
    }
}

/**
 * Standalone helper function to log in to Data Vault in a single call.
 * 
 * Usage:
 *   const { loginToDataVault } = require('../pageobjects/LoginPageDV');
 *   await loginToDataVault(page);
 * 
 * @param {import('@playwright/test').Page} page
 * @param {string} [email]
 * @param {string} [password]
 */
async function loginToDataVault(page, email = process.env.USER_EMAIL, password = process.env.USER_PASSWORD) {
    const loginPage = new LoginPageDV(page);
    await loginPage.login(email, password);
}

module.exports = {
    LoginPageDV,
    loginToDataVault
};

