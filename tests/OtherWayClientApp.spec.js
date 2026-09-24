const {test , expect} = require('@playwright/test')

test('OtherWat Client  App Test' , async ({page}) =>
{
    await page.goto("https://rahulshettyacademy.com/client/");
    await page.getByPlaceholder("email@example.com").fill("rashmi.gupta.iic.0116@gmail.com");
    await page.getByPlaceholder("enter your passsword").fill("Reyna08@");
    await page.getByRole('button' , {name:"Login"}).click();
    await page.waitForLoadState('networkidle');

    await page.locator(".card-body b").first().waitFor(); //wait for products load

    await page.locator(".card-body").filter({hasText:'ZARA COAT 3'})   //get all the cart value - in that filter product based on text
     .getByRole('button',{name:"Add To Cart"}).click();  //button - add to card - click
    
    await page.getByRole("listitem").getByRole("button", {name:"Cart"}).click();  //scan all the listitem and search for cart button and click

    await page.locator("div li").first().waitFor(); //wait for list load
    await expect( page.getByText("ZARA COAT 3")).toBeVisible(); //to check getBytext item is visible i.e zara coat 3 product
    await  page.getByRole('button' , {name:"Checkout"}).click(); //click on checkout button
    await page.getByPlaceholder("Select Country").pressSequentially("ind"); //enter IND one by one sequentially

    await page.getByRole('button' , {name:"Ind"}).nth(1).click(); //click on India  - on second result

    await  page.getByText("PLACE ORDER").click(); //click on place order button

    await expect (page.getByText(" Thankyou for the order.")).toBeVisible(); //to check order confirmed page

   //const orderId=await page.getByText(" | 6a9a866ce7cd69710fbe646e | ").toBeVisible();
   // await  page.getByRole('button' , {name:"ORDERS"}).click();

    //await page.locator(".ng-star-inserted").filter({has:orderId});
     
});