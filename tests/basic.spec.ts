import { test, expect } from "@playwright/test";

test("run-continue terminates", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // name is 'un' because of separate span
  await page.getByRole("button", { name: "un" }).click();

  // wait until toast pops up
  await page.locator('.Toastify__toast').getByText("front").waitFor({ state: "attached" });

  // expects toast "Execution reached the front"
  expect(await page.locator('.Toastify__toast').allTextContents().then(texts => texts.join(', '))).toContain("front");

  // name is 'ontinue' because of separate span
  await page.getByRole("button", { name: "ontinue" }).first().click();

  // wait until toast pops up
  await page.locator('.Toastify__toast').getByText("Terminated").waitFor({ state: "attached" });

  // expects toast "Terminated"
  expect(await page.locator('.Toastify__toast').allTextContents().then(texts => texts.join(', '))).toContain("Terminated");
});
