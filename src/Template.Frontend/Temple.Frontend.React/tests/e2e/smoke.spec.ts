import { expect, test } from "@playwright/test";

test("displays SmartAdmin shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Temple SmartAdmin")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});
