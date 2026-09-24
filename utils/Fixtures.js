const base  = require('@playwright/test');
const { ApiUtils } = require('./ApiUtils.js');
const {request} = require('@playwright/test');

const loginPayLoad = {userEmail: "rashmi.gupta.iic.0116@gmail.com", userPassword: "Reyna08@"} 
const orderPayLoad  = {orders: [{country: "Cuba", productOrderedId: "6960eae1c941646b7a8b3ed3"}]}; 

exports.customtest = base.test.extend({
    authenticatedPage : async ({page} , use) =>
    {
       // const context = await browser.newContext();
       // const page =await context.newPage();
        await page.goto("https://rahulshettyacademy.com/client/"); //enter url
        await page.locator("#userEmail").fill("rashmi.gupta.iic.0116@gmail.com"); //enter un
        await page.locator("#userPassword").fill("Reyna08@");//enter password
        await page.locator("[value='Login']").click();//click on login
        await page.waitForLoadState('networkidle'); //wait untill page  has no network activity
        await use(page);
        
    } , 
     
    createOrder :async({} , use)=>
    {
        const apiContext= await request.newContext();
        const apiUtils = new ApiUtils(apiContext,loginPayLoad);
        const  response= await apiUtils.createOrder(orderPayLoad);
        await use(response);
    },
    testDataForOrder :
    {
        productName :'ADIDAS ORIGINAL'
    }
});