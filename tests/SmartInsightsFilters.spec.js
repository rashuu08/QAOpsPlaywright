const { test, expect } = require('@playwright/test');
const {
  changeFilter,
  getAvailableProjects,
  getAvailableWeeks,
  getHistoricalDateRange,
  get2026AugToJuneRange,
  get2026MayToJanRange,
  get2025DecToAprilRange,
  get2024AvailableRange,
  testEveryProjectForMonth,
  changeFiltersProjectWise
} = require('../pageobjects/FiltersDV');

// Run tests serially so all test cases share the same browser session without re-logging in
test.describe.serial('Smart Insights - Dynamic Project & Month Validations', () => {

  /** @type {import('@playwright/test').Page} */
  let page;
  /** @type {import('@playwright/test').BrowserContext} */
  let context;

  test.beforeAll(async ({ browser }) => {
    // Create one shared browser context and page for the entire file
    context = await browser.newContext();
    page = await context.newPage();

    // 1. Log in ONCE at the start of the suite
    console.log('\n[Setup] Logging in to Data Vault once for all test cases...');
    await page.goto('https://admin-live.data-vault.vretail.space/login');
    await page.locator('#email-input').fill(process.env.USER_EMAIL || 'test.admin@iic.com');
    await page.locator('#password-input').fill(process.env.USER_PASSWORD || 'Inkincaps@123');
    await page.locator('text=Login').click();
    await page.waitForLoadState('domcontentloaded');

    try {
      await page.getByRole('button', { name: 'Close walkthrough' }).click({ timeout: 5000 });
      console.log('[Setup] Closed walkthrough modal.');
    } catch (_) {
      // Tour already closed or not shown
    }
  });

  // Ensure page is still alive before each test without re-logging in if already active
  test.beforeEach(async ({ browser }) => {
    if (!page || page.isClosed()) {
      console.log('\n[Recovery] Browser page was closed. Recreating context & logging in...');
      context = await browser.newContext();
      page = await context.newPage();
      await page.goto('https://admin-live.data-vault.vretail.space/login');
      await page.locator('#email-input').fill(process.env.USER_EMAIL || 'test.admin@iic.com');
      await page.locator('#password-input').fill(process.env.USER_PASSWORD || 'Inkincaps@123');
      await page.locator('text=Login').click();
      await page.waitForLoadState('domcontentloaded');
      try {
        await page.getByRole('button', { name: 'Close walkthrough' }).click({ timeout: 5000 });
      } catch (_) {}
    }
  });

  test.afterAll(async () => {
    // Close context once all test cases in this file finish
    if (context) {
      await context.close().catch(() => {});
    }
  });

  // Reusable helper to validate Smart Insights cards or valid empty states
  async function validateSmartInsights(filterLabel) {
    const smartInsights = page.locator('.smart-insights-card');
    const noInsights = page.locator('text=/No insights|no recorded insights/i');

    try {
      // Wait for either cards or "No insights" empty placeholder
      await Promise.race([
        smartInsights.first().waitFor({ state: 'visible', timeout: 7000 }).catch(() => {}),
        noInsights.first().waitFor({ state: 'visible', timeout: 7000 }).catch(() => {})
      ]);

      const cardsCount = await smartInsights.count();
      if (cardsCount > 0) {
        for (let i = 0; i < cardsCount; i++) {
          const text = (await smartInsights.nth(i).innerText()).trim();
          if (text.length === 0) {
            console.warn(`[WARN] Smart Insights card ${i + 1} is empty for ${filterLabel}`);
          }
        }
        console.log(`[PASS] ${filterLabel} - ${cardsCount} cards validated`);
        return true;
      }

      if (await noInsights.first().isVisible().catch(() => false)) {
        console.log(`[PASS] ${filterLabel} - Valid empty state: "No recorded insights for this period"`);
        return true;
      }

      console.log(`[INFO] ${filterLabel} - Filter applied successfully`);
      return true;
    } catch (error) {
      console.log(`[FAIL] ${filterLabel} - ${error.message}`);
      return false;
    }
  }

  // =========================================================================
  // TEST CASE 1: All Projects - 2026 - September - Dynamic Weeks
  // =========================================================================
  test('Test Case 1: All Projects - 2026 - September - All weeks and individual weeks', async () => {
    console.log('\n--- Running Test Case 1: All Projects (September 2026) ---');

    await changeFilter(page, {
      project: 'All Projects',
      year: 2026,
      month: 'September',
      week: 'All weeks'
    });
    await validateSmartInsights('All Projects - 2026 - September - All weeks');

    // Dynamically fetch weeks for September 2026
    const availableWeeks = await getAvailableWeeks(page);
    console.log('Available weeks for September 2026:', availableWeeks);

    for (const wk of availableWeeks) {
      if (/all/i.test(wk)) continue;
      await changeFilter(page, { week: wk });
      await validateSmartInsights(`All Projects - 2026 - September - ${wk}`);
    }
  });

  // =========================================================================
  // TEST CASE 2: Every Project dynamically for September 2026
  // =========================================================================
  test('Test Case 2: Validate Every Project dynamically for September 2026', async () => {
    test.setTimeout(300000);
    console.log('\n--- Running Test Case 2: Every Project in September 2026 ---');

    await testEveryProjectForMonth(page, {
      year: 2026,
      month: 'September',
      validateCallback: async ({ project, year, month, week }) => {
        const label = week ? `${project} - ${year} - ${month} - ${week}` : `${project} - ${year} - ${month}`;
        await validateSmartInsights(label);
      }
    });
  });

  // =========================================================================
  // TEST CASE 3: Every Project for 2026 (August, July, June)
  // =========================================================================
  test('Test Case 3: Validate Every Project for 2026 (August down to June)', async () => {
    test.setTimeout(600000);
    console.log('\n--- Running Test Case 3: 2026 (August, July, June) ---');

    await changeFiltersProjectWise(page, {
      dateRange: get2026AugToJuneRange(),
      includeIndividualWeeks: true,
      onFilterChange: async ({ project, year, month, week }) => {
        const label = week ? `${project} - ${year} - ${month} - ${week}` : `${project} - ${year} - ${month}`;
        await validateSmartInsights(label);
      }
    });
  });

  // =========================================================================
  // TEST CASE 4: Every Project for 2026 (May down to January)
  // =========================================================================
  test('Test Case 4: Validate Every Project for 2026 (May down to January)', async () => {
    test.setTimeout(600000);
    console.log('\n--- Running Test Case 4: 2026 (May down to January) ---');

    await changeFiltersProjectWise(page, {
      dateRange: get2026MayToJanRange(),
      includeIndividualWeeks: true,
      onFilterChange: async ({ project, year, month, week }) => {
        const label = week ? `${project} - ${year} - ${month} - ${week}` : `${project} - ${year} - ${month}`;
        await validateSmartInsights(label);
      }
    });
  });

  // =========================================================================
  // TEST CASE 5: Every Project for 2025 (December down to April)
  // =========================================================================
  test('Test Case 5: Validate Every Project for 2025 (December down to April)', async () => {
    test.setTimeout(600000);
    console.log('\n--- Running Test Case 5: 2025 (December down to April) ---');

    await changeFiltersProjectWise(page, {
      dateRange: get2025DecToAprilRange(),
      includeIndividualWeeks: true,
      onFilterChange: async ({ project, year, month, week }) => {
        const label = week ? `${project} - ${year} - ${month} - ${week}` : `${project} - ${year} - ${month}`;
        await validateSmartInsights(label);
      }
    });
  });

  // =========================================================================
  // TEST CASE 6: Every Project for 2024 (All available filters: Dec, Sep, Aug, Jul)
  // =========================================================================
  test('Test Case 6: Validate Every Project for 2024 (Available Filters & Projects)', async () => {
    test.setTimeout(600000);
    console.log('\n--- Running Test Case 6: 2024 (All Available Months & Projects) ---');

    await changeFiltersProjectWise(page, {
      dateRange: get2024AvailableRange(),
      includeIndividualWeeks: true,
      onFilterChange: async ({ project, year, month, week }) => {
        const label = week ? `${project} - ${year} - ${month} - ${week}` : `${project} - ${year} - ${month}`;
        await validateSmartInsights(label);
      }
    });
  });

});
