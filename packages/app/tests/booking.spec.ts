import { expect, test, type Page } from '@playwright/test';

const notice = 'Preview only. Nothing is sent or saved. This is not a booking or an order.';

async function reachReview(page: Page, service: 'Pickup' | 'Dine-in reservation', tap = false): Promise<void> {
  await page.getByLabel('Date', { exact: true }).fill('2026-10-14');
  await page.getByLabel('Time', { exact: true }).fill('09:15');
  const next = page.getByRole('button', { name: 'Next', exact: true });
  if (tap) await next.tap(); else { await next.focus(); await page.keyboard.press('Enter'); }
  await expect(page.getByRole('heading', { name: 'Service', exact: true })).toBeFocused();
  const radio = page.getByRole('radio', { name: service, exact: true });
  if (tap) await radio.tap(); else { await radio.focus(); await page.keyboard.press('Space'); }
  if (tap) await next.tap(); else { await next.focus(); await page.keyboard.press('Enter'); }
  await expect(page.getByRole('heading', { name: 'Review', exact: true })).toBeFocused();
}

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-13T01:00:00Z'));
});

test('required fields, past dates and service errors recover through real keyboard controls', async ({ page }) => {
  await page.goto('/order/');
  await expect(page.getByText(notice)).toBeVisible();
  const date = page.getByLabel('Date', { exact: true });
  const time = page.getByLabel('Time', { exact: true });
  await expect(date).toHaveValue('');
  await expect(time).toHaveValue('');
  await page.getByRole('button', { name: 'Next', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(date).toBeFocused();
  await expect(date).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('Choose a date.', { exact: true })).toBeVisible();
  await expect(page.getByText('Choose a time.', { exact: true })).toBeVisible();
  await date.fill('2026-10-12');
  await expect(page.getByText('Choose today or a later date in Melbourne.')).toBeVisible();
  await date.fill('2026-10-13');
  await time.fill('10:30');
  await expect(date).not.toHaveAttribute('aria-invalid');
  await expect(time).not.toHaveAttribute('aria-invalid');
  await page.getByRole('button', { name: 'Next', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('heading', { name: 'Service', exact: true })).toBeFocused();
  await expect(page.locator('[aria-current="step"]')).toHaveText('2. Service');
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  const pickup = page.getByRole('radio', { name: 'Pickup', exact: true });
  await expect(pickup).toBeFocused();
  await expect(pickup).toHaveAttribute('aria-invalid', 'true');
  await page.keyboard.press('Space');
  await expect(page.getByText('Choose a service.', { exact: true })).toBeHidden();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Date & time', exact: true })).toBeFocused();
  await expect(date).toHaveValue('2026-10-13');
  await expect(time).toHaveValue('10:30');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(pickup).toBeChecked();
});

test('the date boundary is Melbourne midnight, independent of the visitor timezone', async ({ browser, baseURL, viewport }) => {
  const context = await browser.newContext({ baseURL, viewport: viewport ?? undefined, timezoneId: 'America/Los_Angeles' });
  const page = await context.newPage();
  try {
    await page.clock.setFixedTime(new Date('2026-10-12T12:59:59Z'));
    await page.goto('/order/');
    const date = page.getByLabel('Date', { exact: true });
    await date.fill('2026-10-12');
    await page.getByLabel('Time', { exact: true }).fill('23:59');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Service', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await page.clock.setFixedTime(new Date('2026-10-12T13:00:00Z'));
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(date).toBeFocused();
    await expect(page.getByText('Choose today or a later date in Melbourne.')).toBeVisible();
    await date.fill('2026-10-13');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Service', exact: true })).toBeFocused();
  } finally { await context.close(); }
});

test('date and service choices accept actual taps', async ({ browser, baseURL, viewport }) => {
  const context = await browser.newContext({ baseURL, viewport: viewport ?? undefined, hasTouch: true });
  const page = await context.newPage();
  try {
    await page.clock.setFixedTime(new Date('2026-10-13T01:00:00Z'));
    await page.goto('/order/');
    await page.getByLabel('Date', { exact: true }).fill('2026-10-14');
    await page.getByLabel('Time', { exact: true }).fill('09:15');
    await page.getByRole('button', { name: 'Next', exact: true }).tap();
    await page.getByRole('radio', { name: 'Dine-in reservation', exact: true }).tap();
    await expect(page.getByRole('radio', { name: 'Dine-in reservation', exact: true })).toBeChecked();
    await page.getByRole('button', { name: 'Back', exact: true }).tap();
    await expect(page.getByLabel('Time', { exact: true })).toHaveValue('09:15');
  } finally { await context.close(); }
});

for (const service of ['Pickup', 'Dine-in reservation'] as const) {
  test(`review, finish and reset work by keyboard for ${service}`, async ({ page }) => {
    await page.goto('/order/');
    await reachReview(page, service);
    await expect(page.locator('[data-review-date]')).toHaveText('14 October 2026');
    await expect(page.locator('[data-review-time]')).toHaveText('09:15');
    await expect(page.locator('[data-review-service]')).toHaveText(service);
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await expect(page.getByRole('radio', { name: service, exact: true })).toBeChecked();
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await page.getByLabel('Date', { exact: true }).fill('2026-10-15');
    await page.getByLabel('Time', { exact: true }).fill('18:45');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    const other = service === 'Pickup' ? 'Dine-in reservation' : 'Pickup';
    await page.getByRole('radio', { name: other, exact: true }).check();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.locator('[data-review-date]')).toHaveText('15 October 2026');
    await expect(page.locator('[data-review-time]')).toHaveText('18:45');
    await expect(page.locator('[data-review-service]')).toHaveText(other);
    await page.getByRole('button', { name: 'Finish preview', exact: true }).focus();
    await page.keyboard.press('Enter');
    const result = page.getByRole('heading', { name: 'Preview complete', exact: true });
    await expect(result).toBeFocused();
    await expect(result).toHaveAccessibleDescription('Nothing was sent or saved. No booking or order was made.');
    await expect(page.getByText(notice)).toBeVisible();
    await expect(page.locator('[aria-current="step"]')).toHaveText('3. Review');
    await expect(page.locator('[data-booking-preview] [aria-live], [data-booking-preview] [role="status"]')).toHaveCount(0);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Start again', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'Date & time', exact: true })).toBeFocused();
    await expect(page.getByLabel('Date', { exact: true })).toHaveValue('');
    await expect(page.getByLabel('Time', { exact: true })).toHaveValue('');
    await expect(page.locator('[name="preview-service"]:checked')).toHaveCount(0);
  });
}

test('Finish recovers from a Melbourne midnight with choices retained', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-14T12:59:59Z'));
  await page.goto('/order/');
  await reachReview(page, 'Pickup');
  await page.clock.setFixedTime(new Date('2026-10-14T13:00:00Z'));
  await page.getByRole('button', { name: 'Finish preview', exact: true }).click();
  const date = page.getByLabel('Date', { exact: true });
  await expect(date).toBeFocused();
  await expect(date).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('Choose today or a later date in Melbourne.')).toBeVisible();
  await expect(page.getByLabel('Time', { exact: true })).toHaveValue('09:15');
  await date.fill('2026-10-15');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('radio', { name: 'Pickup', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('[data-review-date]')).toHaveText('15 October 2026');
  await page.getByRole('button', { name: 'Finish preview', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Preview complete', exact: true })).toBeFocused();
});

test('the complete preview works by touch, including repeated Finish and reset', async ({ browser, baseURL, viewport }) => {
  const context = await browser.newContext({ baseURL, viewport: viewport ?? undefined, hasTouch: true });
  const page = await context.newPage();
  try {
    await page.clock.setFixedTime(new Date('2026-10-13T01:00:00Z'));
    await page.goto('/order/');
    for (const service of ['Pickup', 'Dine-in reservation'] as const) {
      await reachReview(page, service, true);
      await page.getByRole('button', { name: 'Finish preview', exact: true }).tap();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('heading', { name: 'Preview complete', exact: true })).toBeFocused();
      await expect(page.getByText(notice)).toBeVisible();
      await page.getByRole('button', { name: 'Start again', exact: true }).tap();
      await expect(page.getByLabel('Date', { exact: true })).toHaveValue('');
    }
  } finally { await context.close(); }
});

test('both full preview paths make no request or storage change, and reload clears choices but keeps the theme', async ({ page, context }) => {
  await page.goto('/order/');
  await page.getByRole('button', { name: /Switch to (dark|light) mode/ }).click();
  await page.waitForLoadState('networkidle');
  const storage = () => page.evaluate(async () => ({
    local: { ...localStorage }, session: { ...sessionStorage },
    databases: await indexedDB.databases(), caches: await caches.keys(),
  }));
  const before = await storage();
  const cookies = await context.cookies();
  const dark = await page.locator('html').evaluate((el) => el.classList.contains('dark'));
  const url = page.url();
  const requests: string[] = [];
  page.on('request', (request) => requests.push(`${request.method()} ${request.url()}`));
  for (const service of ['Pickup', 'Dine-in reservation'] as const) {
    await page.getByLabel('Date', { exact: true }).focus();
    await page.keyboard.press('Enter');
    expect(page.url()).toBe(url);
    await reachReview(page, service);
    await page.getByRole('button', { name: 'Finish preview', exact: true }).dblclick();
    await expect(page.getByRole('heading', { name: 'Preview complete', exact: true })).toBeVisible();
    await expect(page.getByText(notice)).toBeVisible();
    await page.getByRole('button', { name: 'Start again', exact: true }).click();
  }
  expect(requests).toEqual([]);
  expect(await storage()).toEqual(before);
  expect(await context.cookies()).toEqual(cookies);
  expect(page.url()).toBe(url);
  await reachReview(page, 'Pickup');
  await page.reload();
  await expect(page.getByLabel('Date', { exact: true })).toHaveValue('');
  await expect(page.getByLabel('Time', { exact: true })).toHaveValue('');
  await expect(page.locator('[name="preview-service"]:checked')).toHaveCount(0);
  expect(await page.locator('html').evaluate((el) => el.classList.contains('dark'))).toBe(dark);
  expect(await storage()).toEqual(before);
  expect(await context.cookies()).toEqual(cookies);
  expect(page.url()).toBe(url);
});

test.describe('without scripts', () => {
  test.use({ javaScriptEnabled: false });
  test('the notice and three-step explanation remain without broken controls', async ({ page }) => {
    await page.goto('/order/');
    await expect(page.getByText(notice)).toBeVisible();
    await expect(page.getByText('Turn on JavaScript to try the preview. Nothing can be sent from this page.')).toBeVisible();
    await expect(page.getByRole('list', { name: 'Preview steps' })).toHaveText(/1\. Date & time.*2\. Service.*3\. Review/);
    await expect(page.locator('[data-preview-controls]')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toHaveCount(0);
  });
});

test('an initialization failure leaves the explanation and sends nothing', async ({ page, baseURL }) => {
  const failures: string[] = [];
  const unexpected: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (request.method() !== 'GET' || url.origin !== new URL(baseURL!).origin || url.search) unexpected.push(request.url());
  });
  page.on('pageerror', (error) => failures.push(error.message));
  // A failure of the browser date formatter exercises initialization before controls appear.
  await page.addInitScript(() => {
    Object.defineProperty(Intl, 'DateTimeFormat', { value: function () { throw new Error('Simulated unavailable date formatter'); } });
  });
  await page.goto('/order/');
  await expect(page.getByText(notice)).toBeVisible();
  await expect(page.locator('[data-preview-fallback]')).toBeVisible();
  await expect(page.locator('[data-preview-controls]')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toHaveCount(0);
  expect(failures).toContain('Simulated unavailable date formatter');
  expect(new URL(page.url()).search).toBe('');
  expect(unexpected).toEqual([]);
});
