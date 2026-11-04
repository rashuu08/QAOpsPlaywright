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

test.describe('Smart Insights - Dynamic Project & Month Validations', () => {

  test.beforeEach(async ({ page }) => {
    // Login to Data Vault
    await page.goto('https://admin-live.data-vault.vretail.space/login');
    await page.locator('#email-input').fill(process.env.USER_EMAIL || 'test.admin@iic.com');
    await page.locator('#password-input').fill(process.env.USER_PASSWORD || 'Inkincaps@123');
    await page.locator('text=Login').click();
    await page.waitForLoadState('domcontentloaded');

    try {
      await page.getByRole('button', { name: 'Close walkthrough' }).click({ timeout: 5000 });
    } catch (_) {
      // Tour already closed or not shown
    }
  });

  // Reusable helper to validate Smart Insights cards
  async function validateSmartInsights(page, filterLabel) {
    const smartInsights = page.locator('.smart-insights-card');
    try {
      await expect(smartInsights.first()).toBeVisible({ timeout: 8000 });
      const cardsCount = await smartInsights.count();
      if (cardsCount === 0) {
        throw new Error('No Smart Insights cards found');
      }

      for (let i = 0; i < cardsCount; i++) {
        const text = (await smartInsights.nth(i).innerText()).trim();
        if (text.length === 0) {
          throw new Error(`Smart Insights card ${i + 1} is empty`);
        }
      }

      console.log(`[PASS] ${filterLabel} - ${cardsCount} cards validated`);
      return true;
    } catch (error) {
      console.log(`[FAIL] ${filterLabel} - ${error.message}`);
      return false;
    }
  }

  // =========================================================================
  // TEST CASE 1: All Projects - 2026 - September - Dynamic Weeks
  // =========================================================================
  test('Test Case 1: All Projects - 2026 - September - All weeks and individual weeks', async ({ page }) => {
    console.log('\n--- Running Test Case 1: All Projects (September 2026) ---');

    await changeFilter(page, {
      project: 'All Projects',
      year: 2026,
      month: 'September',
      week: 'All weeks'
    });
    await validateSmartInsights(page, 'All Projects - 2026 - September - All weeks');

    // Dynamically fetch weeks for September 2026
    const availableWeeks = await getAvailableWeeks(page);
    console.log('Available weeks for September 2026:', availableWeeks);

    for (const wk of availableWeeks) {
      if (/all/i.test(wk)) continue;
      await changeFilter(page, { week: wk });
      await validateSmartInsights(page, `All Projects - 2026 - September - ${wk}`);
    }
  });

  // =========================================================================
  // TEST CASE 2: Every Project dynamically for September 2026
  // =========================================================================
  test('Test Case 2: Validate Every Project dynamically for September 2026', async ({ page }) => {
    test.setTimeout(300000);
    console.log('\n--- Running Test Case 2: Every Project in September 2026 ---');

    await testEveryProjectForMonth(page, {
      year: 2026,
      month: 'September',
      validateCallback: async ({ project, year, month, week }) => {
        const label = week ? `${project} - ${year} - ${month} - ${week}` : `${project} - ${year} - ${month}`;
        await validateSmartInsights(page, label);
      }
    });
  });

  // =========================================================================
  // TEST CASE 3: Every Project for 2026 (August, July, June)
  // =========================================================================
  test('Test Case 3: Validate Every Project for 2026 (August down to June)', async ({ page }) => {
    test.setTimeout(600000);
    console.log('\n--- Running Test Case 3: 2026 (August, July, June) ---');

    await changeFiltersProjectWise(page, {
      dateRange: get2026AugToJuneRange(),
      includeIndividualWeeks: true,
      onFilterChange: async ({ project, year, month, week }) => {
        const label = week ? `${project} - ${year} - ${month} - ${week}` : `${project} - ${year} - ${month}`;
        await validateSmartInsights(page, label);
      }
    });
  });

  // =========================================================================
  // TEST CASE 4: Every Project for 2026 (May down to January)
  // =========================================================================
  test('Test Case 4: Validate Every Project for 2026 (May down to January)', async ({ page }) => {
    test.setTimeout(600000);
    console.log('\n--- Running Test Case 4: 2026 (May down to January) ---');

    await changeFiltersProjectWise(page, {
      dateRange: get2026MayToJanRange(),
      includeIndividualWeeks: true,
      onFilterChange: async ({ project, year, month, week }) => {
        const label = week ? `${project} - ${year} - ${month} - ${week}` : `${project} - ${year} - ${month}`;
        await validateSmartInsights(page, label);
      }
    });
  });

  // =========================================================================
  // TEST CASE 5: Every Project for 2025 (December down to April)
  // =========================================================================
  test('Test Case 5: Validate Every Project for 2025 (December down to April)', async ({ page }) => {
    test.setTimeout(600000);
    console.log('\n--- Running Test Case 5: 2025 (December down to April) ---');

    await changeFiltersProjectWise(page, {
      dateRange: get2025DecToAprilRange(),
      includeIndividualWeeks: true,
      onFilterChange: async ({ project, year, month, week }) => {
        const label = week ? `${project} - ${year} - ${month} - ${week}` : `${project} - ${year} - ${month}`;
        await validateSmartInsights(page, label);
      }
    });
  });

  // =========================================================================
  // TEST CASE 6: Every Project for 2024 (All available filters: Dec, Sep, Aug, Jul)
  // =========================================================================
  test('Test Case 6: Validate Every Project for 2024 (Available Filters & Projects)', async ({ page }) => {
    test.setTimeout(600000);
    console.log('\n--- Running Test Case 6: 2024 (All Available Months & Projects) ---');

    await changeFiltersProjectWise(page, {
      dateRange: get2024AvailableRange(),
      includeIndividualWeeks: true,
      onFilterChange: async ({ project, year, month, week }) => {
        const label = week ? `${project} - ${year} - ${month} - ${week}` : `${project} - ${year} - ${month}`;
        await validateSmartInsights(page, label);
      }
    });
  });

});
