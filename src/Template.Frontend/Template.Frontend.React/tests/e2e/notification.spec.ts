import { expect, test, type BrowserContext } from "@playwright/test";

const statusItem = {
  id: "status-1",
  value: "Active",
  description: "Current status",
  timeStamp: "2026-01-01T00:00:00.000Z",
};

async function authenticateAndMockStatus(context: BrowserContext) {
  await context.addCookies([
    {
      name: "tg_access_token",
      value: "fake-token",
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
    {
      name: "tg_csrf_token",
      value: "csrf-token",
      domain: "127.0.0.1",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);
  await context.route(/\/api\/bff\/status$/, async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify([statusItem]),
    });
  });
}

test("shows a success notification after a confirmed Status deletion", async ({ context, page }) => {
  await authenticateAndMockStatus(context);
  await context.route(/\/api\/bff\/status\/status-1$/, async (route) => {
    await route.fulfill({ status: 204 });
  });

  await page.goto("/status");
  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Yes, delete it!" }).click();

  await expect(page.getByText('Status "Active" was deleted successfully.')).toBeVisible();
  await expect(page.locator(".sa-toast[data-severity='success']")).toBeVisible();
});

test("shows a danger notification when a confirmed Status deletion fails", async ({ context, page }) => {
  await authenticateAndMockStatus(context);
  await context.route(/\/api\/bff\/status\/status-1$/, async (route) => {
    await route.fulfill({ status: 500 });
  });

  await page.goto("/status");
  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Yes, delete it!" }).click();

  await expect(page.getByText("Could not delete status")).toBeVisible();
  await expect(page.locator(".sa-toast[data-severity='danger']")).toBeVisible();
});

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`matches the success notification visual contract at ${viewport.name}`, async ({ context, page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.clock.install({ time: new Date("2026-01-01T00:00:00.000Z") });
    await authenticateAndMockStatus(context);
    await context.route(/\/api\/bff\/status\/status-1$/, async (route) => {
      await route.fulfill({ status: 204 });
    });

    await page.goto("/status");
    await page.getByRole("button", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Yes, delete it!" }).click();

    const notification = page.locator(".sa-toast-container");
    await expect(notification).toBeVisible();
    await expect(notification).toHaveScreenshot(`notification-success-${viewport.name}.png`, {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });
}
