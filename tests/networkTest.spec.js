const {test , expect ,request} = require('@playwright/test');
const {ApiUtils}=require('../utils/ApiUtils');

const loginPayLoad = {userEmail: "rashmi.gupta.iic.0116@gmail.com", userPassword: "Reyna08@"} //the data will be sent to the login API - to authenticate this user through API
const orderPayload  = {orders: [{country: "Cuba", productOrderedId: "6960eae1c941646b7a8b3ed3"}]}; //the data will send to the Create order API - Create an order for this product and country

let response; //declare response variable - to use later

//runs before all tests, only once -Execute this code once before all tests in this file.
test.beforeAll(async()=>
{
    const apiContext = await request.newContext();

    const apiUtils = new ApiUtils(apiContext ,loginPayLoad );
    response = await apiUtils.createOrder(orderPayload);


    await apiContext.dispose();
    
})
test('Intercepting the response' , async ({page})=>
{
    page.addInitScript(async value =>
    {
        await  window.localStorage.setItem('token' , value);
    } , response.token);

    page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/6a967a7721054ba46502ada9" , 
        route =>
        {
            page.request.fetch(route.request)
            //intercepting response - API response ->||| browser -> render data on frontend
        }
    ); 
    await page.goto("https://rahulshettyacademy.com/client/");
    await page.locator("button[routerlink*='myorders']").click(); //click on orders button to go to orders page
    await page.locator("tbody").waitFor(); //wait until the table is loaded on the page
    const rows =await page.locator("tbody tr");
    
});