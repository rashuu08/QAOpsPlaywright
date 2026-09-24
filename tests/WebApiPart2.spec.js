//login   Ui - .json
// add to cart , order confirmation , order details , order history

//to save session storage using Playwright and inject into browser context

const {test , expect }= require('@playwright/test')
let webContext;
test.beforeAll(async({browser}) =>
{
    const context = await browser.newContext();
    const page= await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client/"); //enter url
    await page.locator("#userEmail").fill("rashmi.gupta.iic.0116@gmail.com"); //enter un
    await page.locator("#userPassword").fill("Reyna08@");//enter password
    await page.locator("[value='Login']").click();//click on login
    await page.waitForLoadState('networkidle'); //wait untill page  has no network activity
    await context.storageState({path:'state.json'}); //to save the authentication  state file.
    webContext=await browser.newContext({storageState: 'state.json'}); //injecting the storage data with our data so new browser open will have already stored data related to login
})

test ("Save Session Storage and inject into new Browser Context" , async()=>
{
    const email ="rashmi.gupta.iic.0116@gmail.com";
    const productName= 'ZARA COAT 3';
    const page = await webContext.newPage(); //create a new page
    await page.goto("https://rahulshettyacademy.com/client/"); //enter url
    const products = page.locator(".card-body");
    
    await page.locator(".card-body b").first().waitFor();

    const  titles =await page.locator(".card-body b").allTextContents();//to get the title of a product
    console.log(titles);

    //to get the product count on the page and click on add to cart button for the product name ZARA COAT 3
    const count = await products.count(); //to get the product count on the page
    for(let i=0; i<count; ++i)
    {
      if(await products.nth(i).locator("b").textContent()  === productName)   //if product name is same as the product name in the list then click on add to cart
        {
            //add to cart
            await products.nth(i).locator("text= Add To Cart").click();
            break;
         }
    }
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor(); //wait until 1 element  are loaded on the page 

    const bool=  page.locator("h3:has-text('ZARA COAT 3')").isVisible(); //tagname will be h3 and text will be ZARA COAT 3
    expect(bool).toBeTruthy(); //to check whether the product is present in the cart or not - if present test will pass else fail

    //click on checkout button
    await page.locator("text=Checkout").click(); 

    //to select the country name from the dropdown
    await page.locator("[placeholder*='Country']").pressSequentially("ind" , {delay:150}); // to type character one by one  //a delay of 150 milliseconds is introduced between each key press.
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();

    const countryCount = await dropdown.locator("button").count();
    for (let i=0;i<countryCount; ++i)
    {
          const text= await dropdown.locator("button").nth(i).textContent();
          if(text === " India")
          {
            await dropdown.locator("button").nth(i).click(); //to perform the click on the country name India
            break;
          }
    }

    //to get the email id of the user from the page and verify it with the email id used for login
    expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await page.locator("text=Place Order ").click(); //click on place order button
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. "); //check thank you for the order text is present on the page or not


   const orderId= await page.locator(".em-spacer-1 .ng-star-inserted").textContent(); //get the order id from the page
   console.log(orderId); //print the order id on the console

    //scan the order id  and click on view button
    await page.locator("button[routerlink*='myorders']").click(); //click on orders button to go to orders page
    await page.locator("tbody").waitFor(); //wait until the table is loaded on the page

    const rows=await page.locator("tbody tr"); // grab all the rows from the table and store it in rows variable
    for (let i =0;i< await rows.count(); i++)
    {
      const rowOrderId=await rows.nth(i).locator("th").textContent();
      if(orderId.includes(rowOrderId))
      {
        await rows.locator("button").first().click(); //click on view button first btn
        break;
      }
    }

    const orderIdDetails = await page.locator(".col-text").textContent(); //get the order id from the order details page //textcontent have auto waiting
    await expect (orderId.includes(orderIdDetails)).toBeTruthy(); //check the order id from the order details page is same as the order id from the confirmation page or not


    //await page.pause();
    
});


test ("@API Test case 2" , async()=>
{
    const email ="rashmi.gupta.iic.0116@gmail.com";
    const productName= 'ZARA COAT 3';
    const page = await webContext.newPage(); //create a new page
    await page.goto("https://rahulshettyacademy.com/client/"); //enter url
    const products = page.locator(".card-body");
    
    await page.locator(".card-body b").first().waitFor();

    const  titles =await page.locator(".card-body b").allTextContents();//to get the title of a product
    console.log(titles);
});