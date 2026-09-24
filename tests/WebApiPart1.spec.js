//Use API to login -> Create an order through API -> get the token/order ID ->Open Ui -> 
// Use the API token to skip UI login -> go to My orders  - find the order -> verify the order ID

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

//runs before every test
// test.beforeEach(() =>
// {

// });

test('@API Place the order using Api Testing' , async ({page})=>
{
    page.addInitScript(async value => {
        await  window.localStorage.setItem('token' , value);
    } , response.token);

    await page.goto("https://rahulshettyacademy.com/client/");
    await page.locator("button[routerlink*='myorders']").click(); //click on orders button to go to orders page
    await page.locator("tbody").waitFor(); //wait until the table is loaded on the page

    const rows=await page.locator("tbody tr"); // grab all the rows from the table and store it in rows variable
    for (let i =0;i< await rows.count(); i++)
    {
      const rowOrderId=await rows.nth(i).locator("th").textContent();
      if(response.orderId.includes(rowOrderId))
      {
        await rows.locator("button").first().click(); //click on view button first btn
        break;
      }
    }

    const orderIdDetails = await page.locator(".col-text").textContent(); //get the order id from the order details page //textcontent have auto waiting
    await page.pause();
    await expect (response.orderId.includes(orderIdDetails)).toBeTruthy(); //check the order id from the order details page is same as the order id from the confirmation page or not


    //await page.pause();
    
});

//verify if order created is showing in history page

//Precondition - create order  