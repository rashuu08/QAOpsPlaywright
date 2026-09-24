const { Given, When, Then } = require('@cucumber/cucumber');
const { POManager } = require('../../pageobjects/POManager');
const { expect } = require('@playwright/test');
const playwright = require('@playwright/test');

Given('a login to Ecommerce application with {string} and {string}', { timeout: 100 * 2000 }, async function (userEmail, userPassword) {

  const products = this.page.locator(".card-body");
  const loginPage = this.poManager.getLoginPage();
  await loginPage.goTo();
  await loginPage.validLogin(userEmail, userPassword);
});
//  

When('Add {string} to Cart', async function (productName) {
  this.dashboardPage = this.poManager.getDashboardPage();
  await this.dashboardPage.searchProductAddCart(productName);
  await this.dashboardPage.navigateToCart();
});

Then('Verify {string} is displayed in the Cart', async function (productName) {


  const cartPage = this.poManager.getCartPage();
  await cartPage.VerifyProductIsDisplayed(productName);
  await cartPage.Checkout();
})

When('Enter valid details and Place the Order', async function () {


  const ordersReviewPage = this.poManager.getOrdersReviewPage();
  await ordersReviewPage.searchCountryAndSelect("ind", "India");
  this.orderId = await ordersReviewPage.SubmitAndGetOrderId();
  console.log(this.orderId);

});

Then('Verify order is present in the OrderHistory', async function () {
  await this.dashboardPage.navigateToOrders();
  const orderHistorypage = this.poManager.getOrdersHistoryPage();
  await orderHistorypage.searchOrderAndSelect(this.orderId);
  expect(this.orderId.includes(await orderHistorypage.getOrderId())).toBeTruthy();

});

Given('a login to Ecommerce2 application with {string} and {string}', async function (username, password) {
  const userName = this.page.locator('#username');
  const signIn = this.page.locator("#signInBtn");
  await this.page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  console.log(await this.page.title());
  await userName.type(username);
  await this.page.locator("[type='password']").type(password);
  await signIn.click();
});

Then('Verify Error message is displayed', async function () {
  console.log(await this.page.locator("[style*='block']").textContent()); // Extracting the text from browser and inserting valid expect assertions in test
  await expect(this.page.locator("[style*='block']")).toContainText('Incorrect');

});


