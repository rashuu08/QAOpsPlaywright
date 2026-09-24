//Playwright Special Locators
//1. getBylabel() - to locate the element based on its associated label text
//2. getByPlaceholder() - to locate the input field based on its placeholder text   
//3. getByRole() - to locate the element based on its role attribute
//4.getByText() - to locate the element based on  text visible on webpage
const {test , expect} = require ('@playwright/test')

test('Protocommerce Page Form', async({page}) =>
{
    await page.goto("https://rahulshettyacademy.com/angularpractice/"); 
    await page.getByLabel("Check me out if you Love IceCreams!").click();  //1.getByLaBel() method is used to locate the checkbox element based on its associated label text.
    await page.getByLabel("Employed").check(); //select the radio button for employed
    await page.getByLabel("Gender").selectOption("Female"); // select the gender from the dropdown
    await page.getByPlaceholder("Password").fill("Reyna08@"); //2.getByPlaceholder() method is used to locate the input field based on its placeholder text.
    await page.getByRole('button' , {name:"Submit"}).click();//3.getByRole() method is used to locate the button element based on its role attribute and name.
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible(); //4.getByText() method is used to locate the element based on the text visible on the webpage.
   
    // 5 seconds default timeout for expect assertions --{timeout:10000} - Step level
    await  expect ( page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible({timeout:10_000});
  
    await page.getByRole('link', {name: "Shop"}).click(); //click on shop link

    //get list of elements - filter with nokia edge - click on add to cart button
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();
   // await page.pause();

});

test('Playwright Test Level Time out', async({page}) =>
{
     test.setTimeout(20000);
   const slowExpect= expect.configure({timeout:100000}); //test level time out
  
    page.setDefaultTimeout(9000); //action timeout - test level - work only for actions

    await page.goto("https://rahulshettyacademy.com/angularpractice/"); 
    await page.getByLabel("Check me out if you Love IceCreams!").click();  //1.getByLaBel() method is used to locate the checkbox element based on its associated label text.
    await page.getByLabel("Employed").check(); //select the radio button for employed
    await page.getByLabel("Gender").selectOption("Female"); // select the gender from the dropdown
    await page.getByPlaceholder("Password").fill("Reyna08@"); //2.getByPlaceholder() method is used to locate the input field based on its placeholder text.
    await page.getByRole('button' , {name:"Submit"}).click();//3.getByRole() method is used to locate the button element based on its role attribute and name.
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible(); //4.getByText() method is used to locate the element based on the text visible on the webpage.
   
    // 5 seconds default timeout for expect assertions --{timeout:10000} - Step level
    await  slowExpect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible();
  
    await page.getByRole('link', {name: "Shop"}).click(); //click on shop link
    await slowExpect(page.locator(".my-4").first()).toHaveText("Shop Name"); // to check shop is present on that page

    //get list of elements - filter with nokia edge - click on add to cart button
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();
   // await page.pause();

});