const {test , expect} =require ('@playwright/test');  // to import methods/function  of test class
// const {expect} = require ('../playwright.config');

test('Browser Context Plawright test' ,async ({browser}) =>    //playwright fixture (gloabal varibable + present across project)
{
    //chrome - plugins/cookies
    const context= await browser.newContext();//to create a new page
    const page = await context.newPage();
    const cardTitles = page.locator(".card-body a");
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());

    //css , xpath  - Locators supported by playwright and how to type into elements on page
    await page.locator ('#username').fill("rahulshettyacademy");
    await page.locator("[type='password']").fill("Learning@830$3mK2");
    await page.locator("#signInBtn").click();

  // console.log(await page.locator("[style*='block']").textContent()); // Extracting the text from browser and inserting valid expect assertions in test
  // await expect(page.locator("[style*='block']")).toContainText('Incorrect');  //assertion - to check whether it is present or not

   //console.log(await cardTitles.first().textContent());
   //console.log(await cardTitles.nth(1).textContent());
   const allTitles =await cardTitles.allTextContents();
   []
    console.log(allTitles);

});

test('@Web Page Plawright test' ,async ({page}) =>    //.only  - this test will be run
{
    //open browser and enter the url
    await page.goto("https://google.com");

    //get the title - assertion 
    console.log(await page.title());
    await expect (page).toHaveTitle("Google");
});
test('@Web UI Controls' , async({page}) =>
{
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await page.locator ('#username').fill("rahulshettyacademy");
    await page.locator("[type='password']").fill("Learning@830$3mK2");
    const documentLink = page.locator("[href*='documents-request']");
    //to select a dropdown
    const dropdown = page.locator("select.form-control");
    await dropdown.selectOption("consult");

    await page.locator(".radiotextsty").last().click(); //if only 2 elements are avaialble
    //await page.locator(".radiotextsty").nth(2).click(); // selects the 1 st element in the eadio button
    await page.locator("#okayBtn").click();
    console.log(await page.locator(".radiotextsty").last().isChecked());
    await expect( await page.locator(".radiotextsty").last()).toBeChecked();

    await page.locator("#terms").click(); //to check the checkbox
    await expect(page.locator("#terms")).toBeChecked();  //to check whether checkbix is checked or not
    await page.locator("#terms").uncheck(); //to uncheck the checkbox
    expect (await page.locator("#terms").isChecked()).toBeFalsy(); //to check false-like and true-like  and  // wherever action is performed inside await should be inside the bracket
    
    await expect(documentLink).toHaveAttribute("class" , "blinkingText");//check whther attribute is there or not

    //assertion
    //await page.pause()  //to pause the execution   / or to see the execution
});


//handling child windows and tabs in playwright
test('Child Windows Handling' , async({browser}) =>  //browser- Playwright fixtures are the built-in dependency injection system used to set up the environment, pages, and data required for your end-to-end tests.
{
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator("#username");
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    //to click on document link and open in new tab
    const documentLink = page.locator("[href*='documents-request']");   //* used to give partial name
    
    //set of steps needs to  be  parallelly execute
    const [newPage]= await Promise.all
    ([
        context.waitForEvent('page') ,  //to wait for new page to open and store in page2 variable 
        documentLink.click(),         //new page is opened
    ]) //it will wait untill both the promises is fulfilled
    
    const text = await newPage.locator(".red").textContent(); // to get the text from new page
    const textArray = text.split("@"); //get the domain value from the text and split it into array
    const domain = textArray[1].split(" ")[0];
   // console.log(text);
   // console.log(domain);
    await page.locator("#username").fill(domain); //to type the domain value in username field
    // /console.log(await page.locator("#username").textContent()); //what the HTML element  contains as Tex
     console.log(await page.locator("#username").inputValue()); //what the user entered
   // await page.pause();
}); 