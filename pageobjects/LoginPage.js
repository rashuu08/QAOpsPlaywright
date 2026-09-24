class LoginPage
{
    constructor(page)
    {
        this.page = page;
        this.signInbutton = page.locator("[value='Login']");
        this.userEmail = page.locator('#userEmail');
        this.userPassword =page.locator('#userPassword');
    }
    async  goTo()
    {
        await this.page.goto("https://rahulshettyacademy.com/client/");
    }
    async validLogin(userEmail , userPassword)
    {
        await this.userEmail.fill("rashmi.gupta.iic.0116@gmail.com");
        await this.userPassword.fill("Reyna08@");
        await this.signInbutton.click();
        await this.page.waitForLoadState('networkidle');
    }

}

module.exports ={LoginPage};