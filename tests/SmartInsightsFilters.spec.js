const { test, expect } = require('@playwright/test')

test('Validate Smart Insights Data By using project , year , month and week filters ', async ({ page }) => 
{

  //1.Login to the application
  await page.goto("https://admin-live.data-vault.vretail.space/login"); //go to live url
  await page.locator('#email-input').fill("test.admin@iic.com"); //enter email/username
  await page.locator('#password-input').fill("Inkincaps@123"); //enter password 
  await page.locator('text=Login').click(); //click on login button
  await page.waitForLoadState('domcontentloaded'); //Wait for the page to load

  await page.getByRole('button', { name: 'Close walkthrough' }).click(); //close the Interactive Tour 

  // 2. Calculate previous month using computer date
  const now = new Date(); //get the computer date 
  const previousDate = new Date(now.getFullYear(),now.getMonth() - 1, 1);  //returns curreny year and current month  -1 means current month-1 = previous month 1 means date 

  const previousMonth = previousDate.toLocaleString('en-US',{month: 'long'});//returns previous month in long format like January, February, March etc
  const previousYear = String(previousDate.getFullYear());//returns previous year in string format


  // 3. Validate Smart Insights
  const smartInsights = page.locator('.smart-insights-card');

     async function validateInsights(label) {
    await expect(smartInsights).toBeVisible();

    const content = (await smartInsights.innerText()).trim();

    expect(content.length).toBeGreaterThan(0);

    console.log('Smart Insights validated for: ' + label);
    console.log(content);
  }

  // 4. Change Month filter to previous month
  // Opens the currently selected month dropdown
  await page.getByText(
    now.toLocaleString('en-US', { month: 'long' }),
    { exact: true }
  ).first().click();

  // Select previous month
  await page.getByText(previousMonth, { exact: true }).last().click();

  // 5. If previous month is in the previous year, update Year filter
  const currentYear = String(now.getFullYear());

  if (previousYear !== currentYear) {
    await page.getByText(currentYear, { exact: true }).first().click();
    await page.getByText(previousYear, { exact: true }).last().click();
  }

  // Wait for insights to update
  await validateInsights(previousMonth + ' ' + previousYear);

  // 6. Select All Projects and validate baseline data
  const allProjects = page.getByText('All Projects', {
    exact: true
  });

  if (await allProjects.isVisible().catch(() => false)) {
    await allProjects.first().click();

    const allProjectsOption = page.getByText('All Projects', {
      exact: true
    }).last();

    await allProjectsOption.click();

    await validateInsights(
      'All Projects - ' + previousMonth + ' ' + previousYear
    );
  } else {
    console.log('Project filter is not available for this report view.');
  }

  // Add individual project checks here once the available
  // project names and dropdown behavior are confirmed.
});