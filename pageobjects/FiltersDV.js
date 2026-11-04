/**
 * Reusable Filters Page Object & Utility for Data Vault (Smart Insights & Reports)
 * 
 * Supports:
 *  - Dynamic project filter (auto-adapts when available projects change month-to-month)
 *  - Year dropdown selection (e.g. 2026, 2025, 2024)
 *  - Month dropdown selection (e.g. "September", "August", "July", etc.)
 *  - Week dropdown selection (e.g. "All weeks", "week 1", "week 2", "week 3", "week 4", etc.)
 *  - Dynamic week count retrieval per month/year
 *  - Dynamic project retrieval per month/year
 *  - Test runners for "Every Project, Every Month"
 */

/**
 * Core helper to safely select an option inside a dropdown container.
 * 
 * @param {import('@playwright/test').Page} page 
 * @param {import('@playwright/test').Locator} container 
 * @param {RegExp} optionRegex 
 */
async function selectDropdownOption(page, container, optionRegex) {
  const trigger = container.locator('button.btn, button').first();
  await trigger.waitFor({ state: 'visible', timeout: 7000 });

  const menu = container.locator('ul.menu, ul.dropdown-content');
  const isMenuOpen = await menu.isVisible().catch(() => false);

  if (!isMenuOpen) {
    await trigger.click({ force: true });
    await page.waitForTimeout(200);
  }

  const option = container
    .locator('ul.menu li button, ul.dropdown-content button, [role="option"]')
    .filter({ hasText: optionRegex })
    .first();

  await option.waitFor({ state: 'visible', timeout: 7000 });
  await option.scrollIntoViewIfNeeded();
  await option.click({ force: true });
  await page.waitForTimeout(300); // Allow application state and network response to update
}

/**
 * Dynamically retrieves all available projects from the project dropdown for the active month.
 * Automatically adapts when the project list changes month-to-month.
 * 
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<string[]>}
 */
async function getAvailableProjects(page) {
  // Use the toggle button or the combobox input without strict mode conflict
  const projectToggle = page.locator('button[aria-label="Toggle project list"]').first();
  const projectCombobox = page.locator('input[aria-controls="project-list-options"], input[role="combobox"]').first();
  const trigger = (await projectToggle.isVisible().catch(() => false)) ? projectToggle : projectCombobox;

  await trigger.waitFor({ state: 'visible', timeout: 8000 });

  // Open the project list
  await trigger.click({ force: true });
  await page.waitForTimeout(400);

  // Extract all project options visible in the dropdown list
  const projects = await page.evaluate(() => {
    const listbox = document.querySelector('#project-list-options') || document.body;
    const elements = listbox.querySelectorAll(
      '[role="option"], li, div.cursor-pointer, button'
    );
    const result = [];
    elements.forEach(el => {
      const text = (el.innerText || '').replace(/[\u2713\u2714\u2705✓✔]/g, '').trim().split('\n')[0].trim();
      if (text && text.length > 1 && text.length < 80 && !result.includes(text)) {
        if (!['toggle project list', 'search', 'loading', 'select project'].includes(text.toLowerCase())) {
          result.push(text);
        }
      }
    });
    return result;
  });

  // Close the project list so it doesn't obstruct other UI elements
  await trigger.click({ force: true }).catch(() => {});
  await page.waitForTimeout(200);

  console.log(`[Filter] Discovered ${projects.length} available projects:`, projects.slice(0, 5));
  return projects;
}

/**
 * 1 Reusable function to change Data Vault filters: Project, Year, Month, Week.
 * 
 * Examples:
 *   await changeFilter(page, { project: 'All Projects', year: 2026, month: 'September', week: 'All weeks' });
 *   await changeFilter(page, { project: 'All Projects', year: 2026, month: 'September', week: 'week 1' });
 *   await changeFilter(page, { project: 'L&T Realty Evara Heights', year: 2026, month: 'September' });
 *   await changeFilter(page, { week: 'week 2' });
 * 
 * @param {import('@playwright/test').Page} page
 * @param {Object} filterOptions
 * @param {string} [filterOptions.project] - Project name (e.g. "All Projects", "L&T Realty Evara Heights", "L&T Realty Vayam")
 * @param {string|number} [filterOptions.year] - Year (e.g. 2026, 2025, 2024)
 * @param {string} [filterOptions.month] - Month (e.g. "September", "August", "July")
 * @param {string|number} [filterOptions.week] - Week (e.g. "All weeks", "week 1", "Week 2", 3)
 */
async function changeFilter(page, { project, year, month, week } = {}) {
  // 1. CHANGE YEAR (if provided) - select year first so month & project options reflect that year
  if (year !== undefined && year !== null) {
    const targetYear = String(year).trim();
    console.log(`[Filter] Selecting Year: "${targetYear}"`);

    let yearContainer = page.locator('.dropdown').filter({
      has: page.locator('img[alt="year-icon"]')
    }).first();

    if (!(await yearContainer.isVisible().catch(() => false))) {
      yearContainer = page.locator('.dropdown').filter({
        hasText: /(202[0-9]|Years)/i
      }).first();
    }

    const currentYearText = (await yearContainer.innerText().catch(() => '')).trim();
    if (!currentYearText.includes(targetYear)) {
      await selectDropdownOption(page, yearContainer, new RegExp(`^\\s*${targetYear}\\s*$`, 'i'));
    } else {
      console.log(`[Filter] Year is already "${targetYear}"`);
    }
  }

  // 2. CHANGE MONTH (if provided) - select month next so project list updates for this month
  if (month !== undefined && month !== null) {
    const targetMonth = String(month).trim();
    console.log(`[Filter] Selecting Month: "${targetMonth}"`);

    let monthContainer = page.locator('.dropdown').filter({
      has: page.locator('img[alt="month-icon"]')
    }).first();

    if (!(await monthContainer.isVisible().catch(() => false))) {
      monthContainer = page.locator('.dropdown').filter({
        hasText: /(January|February|March|April|May|June|July|August|September|October|November|December|All Months)/i
      }).first();
    }

    const currentMonthText = (await monthContainer.innerText().catch(() => '')).trim();
    if (!currentMonthText.toLowerCase().includes(targetMonth.toLowerCase())) {
      await selectDropdownOption(page, monthContainer, new RegExp(`^\\s*${targetMonth}\\s*$`, 'i'));
    } else {
      console.log(`[Filter] Month is already "${targetMonth}"`);
    }
  }

  // 3. CHANGE PROJECT (if provided)
  if (project !== undefined && project !== null) {
    const targetProject = String(project).trim();
    console.log(`[Filter] Selecting Project: "${targetProject}"`);

    try {
      const projectToggle = page.locator('button[aria-label="Toggle project list"]').first();
      const projectCombobox = page.locator('input[aria-controls="project-list-options"], input[role="combobox"]').first();
      const trigger = (await projectToggle.isVisible().catch(() => false)) ? projectToggle : projectCombobox;

      await trigger.waitFor({ state: 'visible', timeout: 8000 });

      let currentProject = '';
      if (await projectCombobox.isVisible().catch(() => false)) {
        currentProject = (await projectCombobox.inputValue().catch(() => '')) ||
                         (await projectCombobox.getAttribute('placeholder').catch(() => '')) ||
                         (await projectCombobox.innerText().catch(() => ''));
      }

      if (!currentProject.toLowerCase().trim().includes(targetProject.toLowerCase().trim())) {
        // Open the dropdown list
        await trigger.click({ force: true });
        await page.waitForTimeout(300);

        // Find the matching project option inside #project-list-options or visible options
        const escaped = targetProject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const option = page.locator('#project-list-options li, #project-list-options [role="option"], #project-list-options div, [role="option"]')
          .filter({ hasText: new RegExp(`^\\s*${escaped}`, 'i') })
          .first();

        if (await option.isVisible({ timeout: 2500 }).catch(() => false)) {
          await option.scrollIntoViewIfNeeded();
          await option.click({ force: true });
          await page.waitForTimeout(400);
        } else {
          // Fallback: Type in combobox search field if editable
          if (await projectCombobox.isEditable().catch(() => false)) {
            await projectCombobox.fill('');
            await projectCombobox.fill(targetProject);
            await page.waitForTimeout(300);

            const filteredOption = page.locator('#project-list-options li, #project-list-options [role="option"], [role="option"]')
              .filter({ hasText: new RegExp(escaped, 'i') })
              .first();

            if (await filteredOption.isVisible({ timeout: 2000 }).catch(() => false)) {
              await filteredOption.click({ force: true });
            } else {
              await page.keyboard.press('Enter');
            }
            await page.waitForTimeout(400);
          }
        }
      } else {
        console.log(`[Filter] Project is already "${targetProject}"`);
      }
    } catch (err) {
      console.warn(`[Filter] Could not set project "${targetProject}": ${err.message}`);
    }
  }

  // 4. CHANGE WEEK (if provided - only active for All Projects)
  if (week !== undefined && week !== null) {
    const weekStr = String(week).trim();
    console.log(`[Filter] Selecting Week: "${weekStr}"`);

    let weekContainer = page.locator('.dropdown').filter({
      has: page.locator('img[alt="week-icon"]')
    }).first();

    if (!(await weekContainer.isVisible().catch(() => false))) {
      weekContainer = page.locator('.dropdown').filter({
        hasText: /(Weeks|All weeks|Week \d)/i
      }).first();
    }

    // Check if Week dropdown is available on current project view
    const isWeekVisible = await weekContainer.isVisible().catch(() => false);
    if (!isWeekVisible) {
      console.log(`[Filter] Week filter is not present for this project view. Skipping week "${weekStr}".`);
      return;
    }

    // Match "All weeks" or "Week X"
    let weekRegex;
    if (/all/i.test(weekStr)) {
      weekRegex = /^All\s*weeks/i;
    } else {
      const match = weekStr.match(/\d+/);
      const weekNum = match ? match[0] : weekStr;
      weekRegex = new RegExp(`^Week\\s*${weekNum}\\b`, 'i');
    }

    // Check if current week already matches target
    const currentWeekText = (await weekContainer.innerText().catch(() => '')).trim();
    if (!weekRegex.test(currentWeekText)) {
      await selectDropdownOption(page, weekContainer, weekRegex);
    } else {
      console.log(`[Filter] Week is already "${weekStr}"`);
    }
  }
}

/**
 * Dynamically retrieves all available weeks from the UI for the currently selected Month & Year.
 * (e.g. ['All weeks', 'Week 1', 'Week 2', 'Week 3', 'Week 4'] or includes 'Week 5', 'Week 6')
 * Returns an empty array if week filter is not available on current view.
 * 
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<string[]>}
 */
async function getAvailableWeeks(page) {
  let weekContainer = page.locator('.dropdown').filter({
    has: page.locator('img[alt="week-icon"]')
  }).first();

  if (!(await weekContainer.isVisible().catch(() => false))) {
    weekContainer = page.locator('.dropdown').filter({
      hasText: /(Weeks|All weeks|Week \d)/i
    }).first();
  }

  // If no week dropdown exists on page, return empty array immediately
  if (!(await weekContainer.isVisible().catch(() => false))) {
    return [];
  }

  const trigger = weekContainer.locator('button.btn, button').first();
  const menu = weekContainer.locator('ul.menu, ul.dropdown-content');

  const isMenuOpen = await menu.isVisible().catch(() => false);
  if (!isMenuOpen) {
    await trigger.click({ force: true });
    await page.waitForTimeout(200);
  }

  const weekButtons = weekContainer.locator('ul.menu li button, ul.dropdown-content button');
  const count = await weekButtons.count();
  const weeks = [];

  for (let i = 0; i < count; i++) {
    const spanText = await weekButtons.nth(i).locator('span').first().innerText().catch(() => '');
    const cleanText = spanText.trim() || (await weekButtons.nth(i).innerText()).split('\n')[0].trim();
    if (cleanText) {
      weeks.push(cleanText);
    }
  }

  // Close dropdown
  await trigger.click({ force: true }).catch(() => {});
  await page.waitForTimeout(200);

  return weeks;
}

/**
 * Returns number of weeks mathematically for a given month and year.
 * 
 * @param {number|string} year 
 * @param {string|number} month - Month name (e.g. "September") or month number (1-12)
 * @returns {number}
 */
function calculateWeeksInMonth(year, month) {
  const monthNames = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  let monthIndex;
  if (typeof month === 'string') {
    monthIndex = monthNames.indexOf(month.toLowerCase().trim());
  } else {
    monthIndex = Number(month) - 1;
  }
  if (monthIndex < 0 || monthIndex > 11) return 4;

  const y = Number(year);
  const firstDay = new Date(y, monthIndex, 1).getDay();
  const totalDays = new Date(y, monthIndex + 1, 0).getDate();
  return Math.ceil((firstDay + totalDays) / 7);
}

/**
 * Helper to generate the full list of Year + Month targets from September 2026 down to July 2024.
 * 
 * @returns {Array<{ year: number, month: string }>}
 */
function getHistoricalDateRange() {
  return [
    // 2026: September down to January
    ...get2026AugToJuneRange(),
    ...get2026MayToJanRange(),
    // 2025: December down to April
    ...get2025DecToAprilRange(),
    // 2024: December down to July
    ...get2024AvailableRange()
  ];
}

/**
 * 2026: August down to June
 */
function get2026AugToJuneRange() {
  return [
    { year: 2026, month: 'August' },
    { year: 2026, month: 'July' },
    { year: 2026, month: 'June' }
  ];
}

/**
 * 2026: May down to January
 */
function get2026MayToJanRange() {
  return [
    { year: 2026, month: 'May' },
    { year: 2026, month: 'April' },
    { year: 2026, month: 'March' },
    { year: 2026, month: 'February' },
    { year: 2026, month: 'January' }
  ];
}

/**
 * 2025: December down to April
 */
function get2025DecToAprilRange() {
  return [
    { year: 2025, month: 'December' },
    { year: 2025, month: 'November' },
    { year: 2025, month: 'October' },
    { year: 2025, month: 'September' },
    { year: 2025, month: 'August' },
    { year: 2025, month: 'July' },
    { year: 2025, month: 'June' },
    { year: 2025, month: 'May' },
    { year: 2025, month: 'April' }
  ];
}

/**
 * 2024: All available months (December down to July)
 */
function get2024AvailableRange() {
  return [
    { year: 2024, month: 'December' },
    { year: 2024, month: 'September' },
    { year: 2024, month: 'August' },
    { year: 2024, month: 'July' }
  ];
}

/**
 * Reusable helper to test EVERY project for a given month and year.
 * Dynamically discovers whatever projects are active in that specific month.
 * 
 * @param {import('@playwright/test').Page} page
 * @param {Object} options
 * @param {string|number} options.year
 * @param {string} options.month
 * @param {Function} options.validateCallback - async ({ project, year, month, week }) => {}
 * @param {boolean} [options.includeWeeksForBaseline=true]
 */
async function testEveryProjectForMonth(page, { year, month, validateCallback, includeWeeksForBaseline = true }) {
  console.log(`\n========================================`);
  console.log(`📅 TESTING EVERY PROJECT FOR: ${month} ${year}`);
  console.log(`========================================`);

  // 1. Select Year & Month first so the UI updates the project list for this month
  await changeFilter(page, { year, month });

  // 2. Dynamically fetch all projects active for this month
  const availableProjects = await getAvailableProjects(page);
  console.log(`Found ${availableProjects.length} active projects for ${month} ${year}:`, availableProjects);

  // 3. Iterate through every project in this month
  for (const project of availableProjects) {
    console.log(`\n👉 Testing Project: "${project}" for ${month} ${year}`);
    // Only switch project (year & month are already set for this month loop)
    await changeFilter(page, { project });

    // If "All Projects", also test dynamic weeks if available
    if (/all projects/i.test(project) && includeWeeksForBaseline) {
      await changeFilter(page, { week: 'All weeks' });
      if (typeof validateCallback === 'function') {
        await validateCallback({ project, year, month, week: 'All weeks' });
      }

      const weeks = await getAvailableWeeks(page);
      for (const wk of weeks) {
        if (/all/i.test(wk)) continue;
        await changeFilter(page, { week: wk });
        if (typeof validateCallback === 'function') {
          await validateCallback({ project, year, month, week: wk });
        }
      }
    } else {
      // Specific project (Year + Month)
      if (typeof validateCallback === 'function') {
        await validateCallback({ project, year, month, week: null });
      }
    }
  }
}

/**
 * 1 Master Function to change filters Project-Wise across multiple months:
 * For every month, dynamically fetches the active projects and validates them.
 * 
 * @param {import('@playwright/test').Page} page
 * @param {Object} [options]
 * @param {Array<{year: number, month: string}>} [options.dateRange] - Target dates (defaults to Sep 2026 -> Jul 2024)
 * @param {boolean} [options.includeIndividualWeeks=true] - Whether to select weeks on All Projects
 * @param {Function} [options.onFilterChange] - Callback invoked after each filter change
 */
async function changeFiltersProjectWise(page, {
  dateRange = getHistoricalDateRange(),
  includeIndividualWeeks = true,
  onFilterChange = null
} = {}) {
  for (const { year, month } of dateRange) {
    await testEveryProjectForMonth(page, {
      year,
      month,
      validateCallback: onFilterChange,
      includeWeeksForBaseline: includeIndividualWeeks
    });
  }
}

module.exports = {
  changeFilter,
  getAvailableProjects,
  getAvailableWeeks,
  calculateWeeksInMonth,
  getHistoricalDateRange,
  get2026AugToJuneRange,
  get2026MayToJanRange,
  get2025DecToAprilRange,
  get2024AvailableRange,
  testEveryProjectForMonth,
  changeFiltersProjectWise
};
