//Create a brand new event from the admin panel, then complete a booking for that event, and finally verify the seat count drops by exactly 1.

 const {test , expect}  = require ('@playwright/test')
 test("Event Creation" , async({page})=>
 {
   //Step 1 — Login
    await page.goto("https://eventhub.rahulshettyacademy.com/login"); //Navigate to /login
    await page.getByPlaceholder("you@email.com").fill("reyna123@gmail.com"); //Fill email field (locate by placeholder you@email.com)
    await page.getByPlaceholder("••••••").fill("Reyna08@")   //Fill password field (locate by label Password)
    await page.getByRole("button" , {name:'Sign In'}).click();

    //await expect( page.getByRole('link', { name: 'Browse Events' })).toBeVisible();

    //Step 2- create a new Event 
    await page.locator("id=nav-events").click();//click on event tab
    await page.getByRole("button" ,{name:"Add New Event"}).click();
    await page.locator("id=event-title-input").fill("Reyna Event");
    await page.getByPlaceholder("Describe the event…").fill("This event is just for testing purpose");
    await page.getByLabel("category").selectOption("Festival");
    await page.locator("id=city").fill("Mumbai");
    await page.getByRole("textbox" , {name:"Event Date & Time"}).fill("2026-12-31T12:00");
    await page.locator("id=venue").fill("ABC Park , Mumbai - 64");
    await page.locator("id=price-($)").fill("100");
    await page.locator("id=total-seats").fill("100");
    await page.locator("id=image-url-(optional)").fill("https://wwww.google.com");
    await page.getByRole("button" , {name:"Add Event"}).click();//click on add event button
    await page.locator("id=nav-events").click();//click on events page
    await page.getByRole("article").filter({hasText: 'Reyna Event'}).locator("id=book-now-btn").click(); //click on book Now button 

    await page.getByPlaceholder("Your full name").fill("zara");//enter full name
    await page.getByPlaceholder("you@email.com").fill("zara@gmail.com");//enter email
    await page.locator("id=phone").fill("9123456789");//enter phone number
    await page.getByRole("button" , {name:"Confirm Booking"}).click(); //click on confirm booking button

    //await page.getByRole("id:nav-bookings").click();//click on my bookings
    
    await page.pause();
 });


  //await page.getByRole('article').filter({ hasText: 'FestivalReyna EventThu, 31' }).getByTestId('book-now-btn').click();