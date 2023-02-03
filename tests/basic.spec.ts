import { test, expect } from '@playwright/test';

test('run-continue terminates', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  // name is 'un' because of separate span
  await page.getByRole('button', { name: 'un' }).click();
  // name is 'ontinue' because of separate span
  await page.getByRole('button', { name: 'ontinue' }).first().click();
  await page.getByText('Terminated').click();
});