import {test , expect} from '@playwright/test';

const BASE_URL = 'https://eventhub.rahulshettyacademy.com'
const USER_EMAIL='reyna123@gmail.com'
const USER_PASSWORD= 'Reyna08@'

//login function to reuse
async function login(page) 
{
    await page.goto(`${BASE_URL}/login`);   //`${variable}`  → insert variable into a string
    await page.getByPlaceholder("you@email.com").fill(USER_EMAIL); //enter email
    await page.getByLabel("Password").fill(USER_PASSWORD); //enter password
    await page.getByRole("button" , {name:'Sign In'}).click(); //click on sign in Buttton
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible(); //After logging in, I expect the "Browse Events →" link to be visible.
}

test("create event via UI, book it, and verify seat reduction" , async({page}) =>
{
    await login(page);   //call login function

    await page.goto(`${BASE_URL}/admin/events`);

    const eventTitle = `Test Event ${Date.now()}`; //just to create unique event name 
    await page.locator('#event-title-input').fill(eventTitle); //enter title
    await page.getByPlaceholder("Describe the event…").fill("This event is just for testing purpose"); //enter description

    await page.getByLabel('City').fill('Mumbai'); //enter city
    await page.getByLabel('Venue').fill('Test Venue');//enter venue

    await page.getByLabel('Event Date & Time').fill('2027-12-31T10:00'); //enter date and time
    await page.getByLabel('Price ($)').fill('100');//enter price
    await page.getByLabel('Total Seats').fill('50'); //enter seats
    await page.getByRole("button" , {name:"Add Event"}).click();//click on add event button

    await expect(page.getByText('Event created!')).toBeVisible();// Wait for success toast
    console.log(`Created Event:"${eventTitle}`)

    //Go to Events page and find the newly created card
    await page.goto(`${BASE_URL}/events`);
    const eventCards =page.locator("#event-card"); 
    await expect(eventCards.first()).toBeVisible();

    // Scan all visible event cards for the one matching our created title
    const targetCard = eventCards.filter({hasText:eventTitle}).first();
    await expect(targetCard).toBeVisible();

    // Capture seat count before booking
    const seatsBeforeBooking = parseInt(await targetCard.getByText('seat').first().innerText());
    console.log(`Seats before booking :${seatsBeforeBooking}`);

    await targetCard.getByTestId('book-now-btn').click()

     // Quantity defaults to 1 — verify via id
     //fill the booking form
    const ticketCount = page.locator('#ticket-count');
    await expect(ticketCount).toHaveText('1');

    await page.getByPlaceholder("Your full name").fill("zara");//enter full name
    await page.getByPlaceholder("you@email.com").fill("zara@gmail.com");//enter email
    await page.locator("id=phone").fill("9123456789");//enter phone number
    await page.getByRole("button" , {name:"Confirm Booking"}).click(); //click on confirm booking button


// // ── Step 5: Verify booking confirmation ──────────────────────────────────

//   // Located by CSS class
//   const bookingRefEl = page.locator('.booking-ref').first();
//   await expect(bookingRefEl).toBeVisible();

//   const bookingRef = (await bookingRefEl.innerText()).trim();
//   expect(bookingRef.charAt(0)).toBe(eventTitle.trim().charAt(0).toUpperCase());

//   console.log(`Booking confirmed. Ref: ${bookingRef}`);

//   // ── Step 6: Verify booking appears in My Bookings ────────────────────────
//   await page.getByRole('button', { name: 'My View My Bookings' }).click();
//   await expect(page).toHaveURL(`${BASE_URL}/bookings`);

//   // Located by id
//   const bookingCards = page.locator('#booking-card');
//   await expect(bookingCards.first()).toBeVisible();

//   // Find the card that contains our booking ref (via CSS class inside the card)
//   const matchingCard = bookingCards.filter({ has: page.locator('.booking-ref', { hasText: bookingRef }) });
//   await expect(matchingCard).toBeVisible();

//   // Verify event title also appears in the same card
//   await expect(matchingCard).toContainText(eventTitle);

//   console.log(`Booking card found in My Bookings for ref: ${bookingRef}`);

//   // ── Step 7: Verify seat count reduced on Events page ─────────────────────
//   await page.goto(`${BASE_URL}/events`);
//   await expect(eventCards.first()).toBeVisible();

//   // Find the same event by title
//   const updatedCard       = eventCards.filter({ hasText: eventTitle }).first();
//   await expect(updatedCard).toBeVisible();

//   const seatsAfterBooking = parseInt(await updatedCard.getByText('seat').first().innerText());
//   console.log(`Seats after booking: ${seatsAfterBooking}`);

//   // Booked 1 ticket — count must drop by exactly 1
//   expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});

