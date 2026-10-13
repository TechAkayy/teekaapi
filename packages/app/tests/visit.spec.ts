import { expect, test } from '@playwright/test';

test('visit facts remain unknown and the local schematic makes no location claim or external request', async ({ page, baseURL, viewport }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin) external.push(request.url());
  });
  await page.goto('/visit/');
  await expect(page.getByRole('heading', { name: 'Visit Us', level: 1 })).toBeVisible();
  await expect(page.locator('[data-visit-facts] dt')).toHaveText(['Address', 'Opening hours', 'Phone']);
  await expect(page.locator('[data-visit-facts] dd')).toHaveText(Array(3).fill('To be confirmed'));
  await expect(page.locator('[data-travel-notes] dt')).toHaveText(['Parking', 'Public transport', 'Nearby landmarks']);
  await expect(page.locator('[data-travel-notes] dd')).toHaveText(Array(3).fill('Details will be added when the location is confirmed.'));
  const map = page.getByRole('img', { name: 'Illustrative map — location to be confirmed' });
  await map.scrollIntoViewIfNeeded();
  await expect(map).toBeVisible();
  await expect(page.locator('figcaption')).toHaveText('Illustrative map — location to be confirmed');
  const detailBox = await page.locator('[data-visit-facts]').boundingBox();
  const mapBox = await map.boundingBox();
  if (viewport!.width >= 1024) expect(mapBox!.x).toBeGreaterThan(detailBox!.x + detailBox!.width);
  else expect(mapBox!.y).toBeGreaterThan(detailBox!.y + detailBox!.height);
  await page.waitForLoadState('networkidle');
  expect(external).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});

test('the map word stays inside the drawing and below the pin when text is enlarged', async ({ page }) => {
  await page.goto('/visit/');
  await page.evaluate(() => document.fonts.ready);
  const map = page.getByRole('img', { name: 'Illustrative map — location to be confirmed' });
  for (const size of ['100%', '200%']) {
    // Text-size simulation, not native browser zoom.
    await page.evaluate((value) => { document.documentElement.style.fontSize = value; }, size);
    const frame = (await map.boundingBox())!;
    const word = (await map.locator('text').boundingBox())!;
    const pin = (await map.locator('path').last().boundingBox())!;
    expect(word.x).toBeGreaterThanOrEqual(frame.x);
    expect(word.x + word.width).toBeLessThanOrEqual(frame.x + frame.width);
    expect(word.y).toBeGreaterThan(pin.y + pin.height);
    expect(word.y + word.height).toBeLessThanOrEqual(frame.y + frame.height);
  }
});

for (const javaScriptEnabled of [true, false]) {
  test.describe(javaScriptEnabled ? 'with scripts' : 'without scripts', () => {
    test.use({ javaScriptEnabled });
    test('unavailable actions remain visible and cannot navigate, download or send', async ({ page }) => {
      await page.goto('/visit/');
      await page.waitForLoadState('networkidle');
      const requests: string[] = [];
      const downloads: string[] = [];
      page.on('request', (request) => requests.push(request.url()));
      page.on('download', (download) => downloads.push(download.suggestedFilename()));
      const url = page.url();
      const notice = 'These actions will be available when the cafe confirms its visit details.';
      await expect(page.getByText(notice)).toBeVisible();
      for (const name of ['Get Directions', 'Call', 'Add to Calendar']) {
        const button = page.getByRole('button', { name, exact: true });
        await expect(button).toBeDisabled();
        await expect(button).toHaveAccessibleDescription(notice);
        await button.scrollIntoViewIfNeeded();
        const box = (await button.boundingBox())!;
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await page.keyboard.press('Enter');
      }
      expect(page.url()).toBe(url);
      expect(requests).toEqual([]);
      expect(downloads).toEqual([]);
    });
  });
}
