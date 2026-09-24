const {expect} = require('@playwright/test');
const{customtest} = require('../utils/fixtures.js');

//custom fixture

    
customtest('Fixtures demo' , async({authenticatedPage ,createOrder ,testDataForOrder}) =>
{
    //login to application/create order and verify if the order is created from history page.
    await authenticatedPage.goto('https://rahulshettyacademy.com/client/');
    await authenticatedPage.locator("button[routerlink='myorders']").click();
    await authenticatedPage.locator("tbody").waitFor();
    await expect(authenticatedPage.getByText(createOrder.orderId)).toBeVisible(); 
    console.log(testDataForOrder.productName);
    
});
