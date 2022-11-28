import { test, expect } from '@playwright/test';

test('run-stepout terminates', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Run' }).click();
  await page.getByRole('button', { name: 'Step-Out' }).first().click();
  await page.getByText('Terminated').click();
});