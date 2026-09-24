const { test, expect } = require('@playwright/test')
const { customtest } = require('../utils/test-base');
const { POManager } = require('../pageobjects/POManager');

//json -> string -> js object 
const dataset = JSON.parse(JSON.stringify(require("../utils/placeorderTestData.json")));  //JSON.parse() ->converts that string back into an object.

for (const data of dataset) {
   test(`Client App Login for ${data.productName} `, async ({ page }) => {
      const poManager = new POManager(page);
      // const userEmail ="rashmi.gupta.iic.0116@gmail.com";
      // const userPassword = "Reyna08@";
      // const productName= 'ZARA COAT 3';
      const products = page.locator(".card-body");
      const loginPage = poManager.getLoginPage();

      await loginPage.goTo();
      await loginPage.validLogin(data.userEmail, data.userPassword);

      const dashboardPage = poManager.getDashboardPage();
      await dashboardPage.searchProductAddCart(data.productName);
      await dashboardPage.navigateToCart();

      const cartPage = poManager.getCartPage();
      await cartPage.VerifyProductIsDisplayed(data.productName);
      await cartPage.Checkout();

      const ordersReviewPage = poManager.getOrdersReviewPage();
      await ordersReviewPage.searchCountryAndSelect("ind", "India");
      const orderId = await ordersReviewPage.SubmitAndGetOrderId();
      console.log(orderId);

      await dashboardPage.navigateToOrders();
      const orderHistorypage = poManager.getOrdersHistoryPage();
      await orderHistorypage.searchOrderAndSelect(orderId);
      expect(orderId.includes(await orderHistorypage.getOrderId())).toBeTruthy();

   });
}


customtest('Client App Login ', async ({ page, testDataForOrder }) => {
   const poManager = new POManager(page);
   // const userEmail ="rashmi.gupta.iic.0116@gmail.com";
   // const userPassword = "Reyna08@";
   // const productName= 'ZARA COAT 3';
   const products = page.locator(".card-body");
   const loginPage = poManager.getLoginPage();

   await loginPage.goTo();
   await loginPage.validLogin(testDataForOrder.userEmail, testDataForOrder.userPassword);

   const dashboardPage = poManager.getDashboardPage();
   await dashboardPage.searchProductAddCart(testDataForOrder.productName);
   await dashboardPage.navigateToCart();

   const cartPage = poManager.getCartPage();
   await cartPage.VerifyProductIsDisplayed(testDataForOrder.productName);
   await cartPage.Checkout();
});